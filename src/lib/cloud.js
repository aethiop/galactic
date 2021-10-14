// @ts-nocheck
import { writable } from "svelte/store";
import { tweened } from "svelte/motion";
import { user } from "./db.js";
import { files } from "./store.js";

export let downloading = false;
export let data = null;
export let progress = tweened(0);
let reader = {};

export function uploadFile(folder, file) {
	var slice_size = 1024 * 1024;
	let length;
	let prev = user.get(folder);

	async function splitAndUpload(b64, test) {
		var b64String = b64.slice(0, slice_size);
		test = test || [];
		if (b64.length) {
			progress.set((1 - b64.length / length) * 100);
			prev.put({ data: b64String });
			prev = prev.get("next");
			test.push(
				await SEA.work(b64String, null, null, {
					name: "SHA-256",
				})
			);
			splitAndUpload(b64.slice(slice_size), test);
		} else {
			console.log(test);
			progress.set(100);
		}
	}
	function upload() {
		if (file) {
			reader = new FileReader();
			createFile(folder, file.name, file.type);
			prev = user.get(folder).get(file.name).get("next");

			reader.onloadend = async function (e) {
				if (file.size <= slice_size) {
					slice_size = file.size;
				}
				let b64 = e.target.result;
				length = b64.length;
				user.get(folder).get(file.name).get("size").put(length);
				user.get(folder)
					.get(file.name)
					.get("proof")
					.put(
						await SEA.work(b64, null, null, {
							name: "SHA-256",
						})
					);
				splitAndUpload(b64);
			};
			reader.readAsDataURL(file);
		}
	}

	return upload();
}

export function fetchFiles(folder) {
	var data = [];
	files.set([]);
	user.get(folder)
		.map()
		.once(async (d, name) => {
			if (d) {
				data = [...data, { name: name, folder: folder }];
				files.set(data);
			}
		});
	data = [];
}

export async function getFile(folder, fileId) {
	let test = [];
	var next = user.get(folder).get(fileId);
	let proof = await next.get("proof");
	let size = await next.get("size");

	// async function chunkAndConcatnate(file, chunks) {
	// 	chunks = chunks || "";
	// 	if ((await next.get("next").get("data")) !== null) {
	// 		next = next.get("next");
	// 		chunks += await next.get("data");
	// 		chunkAndConcatnate(file, chunks);
	// 	} else {
	// 		return chunks;
	// 	}
	// }
	async function chunkAndConcatnate(next, chunks) {
		next = next.get("next") || next;
		var chunks = chunks || "";
		console.log(((chunks.length / size) * 100).toFixed(2), "%");
		if (
			proof ===
			(await SEA.work(chunks, null, null, {
				name: "SHA-256",
			}))
		) {
			return chunks;
		}
		next.get("data").once((chunk) => {
			chunks += chunk;
		});
		chunks += await next.get("data");
		return chunkAndConcatnate(next, chunks);
	}
	// function loop(i) {
	// 	i = i || 0;
	// 	next = next.get("next");
	// 	next.get("data").once((chunk) => {
	// 		// console.log(chunk);
	// 		if (chunk) chunks[i] = chunk;
	// 	});
	// 	loop(i + 1);
	// }
	// loop();
	// console.log(chunks.length);
	// while ((await next.get("next").get("data")) !== null) {
	// 	downloading = true;
	// 	next = next.get("next");
	// 	chunks += await next.get("data");

	// 	test.push(
	// 		await SEA.work(await next.get("data"), null, null, {
	// 			name: "SHA-256",
	// 		})
	// 	);
	// 	console.log(
	// 		await SEA.work(await next.get("data"), null, null, {
	// 			name: "SHA-256",
	// 		})
	// 	);
	// }
	// // console.log(test);
	// console.log(
	// 	await SEA.work(chunks, null, null, {
	// 		name: "SHA-256",
	// 	})
	// );
	var chunks = await chunkAndConcatnate(next);
	return chunks;
}

export function createFile(folder, name, type) {
	user.get(folder).get(name).get("type").put(type.split("/")[0]);
}

export async function restoreFile(folder, fileId) {
	let prevFolder = await user.get(folder).get(fileId).get("from");
	console.log(prevFolder);
	var trashed = user.get(folder).get(fileId);
	// @ts-ignore
	user.get(prevFolder).get(fileId).put(trashed);
	trashed.put(null);
}

// export async function deleteFile(folder, fileId) {
// 	var trashed = user.get(folder).get(fileId);
// 	user.get(folder).get(fileId).put(null);
// 	trashed.get("from").put(folder);
// 	var type = trashed.get("type");
// 	createFile("trash<?30", fileId, await type);
// 	user.get("trash<?30").get(fileId).put(trashed);
// 	fetchFiles(folder);
// }

// export async function completeRemove(folder, fileId) {
// 	user.get(folder).get(fileId).put(null);
// 	fetchFiles(folder);
// }
export async function deleteFile(folder, fileId) {
	var ttl = 3600 * 30;
	var trashed = user.get(folder).get(fileId);
	var type = await trashed.get("type");
	user.get(folder).get(fileId).put(null);
	// @ts-ignore
	user.get("trash<?" + ttl)
		.get(fileId)
		.get("type")
		.put(type.split("/")[0]);
	user.get("trash<?" + ttl)
		.get(fileId)
		.get("from")
		.put(folder);
	user.get("trash<?" + ttl)
		.get(fileId)
		.put(trashed);
}

export async function completeRemove(folder, fileId) {
	user.get(folder).get(fileId).put(null);
}
