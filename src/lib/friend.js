import { gun, user } from "./db.js";
import { friends, requests } from "./store.js";

export async function generateRequestsCertificate() {
	let certificate = await SEA.certify(
		["*"],
		[{ "*": "requests" }],
		user._.sea,
		null,
		{}
	);

	user.get("cert")
		.get("requests")
		.put(certificate, ({ ok }) => {
			console.log("Request Certificate created");
		});
	console.log(await user.get("cert").get("requests"));
}
export async function sendRequest(pub) {
	console.log("FROM: ", user.is.pub);
	console.log("Adding...");
	console.log(await gun.user(pub).get("profile").get("name"));
	const certificate = await gun.user(pub).get("cert").get("requests");
	generateFriendCertificate(pub);

	gun.user(pub)
		.get("requests")
		.set(
			user.is.pub,
			({ err }) => {
				if (err)
					return console.log({
						errMessage: err,
						errCode: "gun-set-error",
					});
				else {
					return console.log("Friend request sent to - " + pub);
				}
			},
			{ opt: { cert: certificate } }
		);

	console.log("Friend Request Sent");
}
export function acceptRequest(pub, soul) {
	gun.user(pub)
		.get("certificates")
		.get("friends")
		.get(user.is.pub)
		.once((certificate) => {
			gun.user(pub)
				.get("friends")
				.set(user.is.pub, null, { opt: { cert: certificate } });
		});
	user.get("requests").get(soul).put(null);
	user.get("requests").get(soul).put(null);
	user.get("friends").set(pub);
	requests.set([]);
}
export function rejectRequest(soul) {
	user.get("requests").get(soul).put(null);
	requests.set([]);
}
async function generateFriendCertificate(pub) {
	var keyPair = user._.sea;

	let certificate = await SEA.certify(
		pub,
		[{ "*": "friends" }],
		keyPair,
		null,
		{}
	);
	user.get("certificates")
		.get("friends")
		.get(pub)
		.put(certificate, ({ ok }) => {
			console.log("Friend Certificate created for: ", pub);
			console.log(certificate);
		});
}
export function getFriends() {
	var f = [];
	friends.set(f);
	user.get("friends")
		.map()
		.once((pub, key) => {
			gun.user(pub)
				.get("profile")
				.get("name")
				.once((name) => {
					f.push({
						username: name,
						pub: pub,
						key: key,
					});
				});
		});
	friends.set(f);
}
export function getRequests() {
	var reqs = [];
	requests.set(reqs);
	user.get("requests")
		.map()
		.once(async (pub, key) => {
			if (pub) {
				gun.user(pub)
					.get("profile")
					.get("name")
					.once((name) => {
						reqs.push({
							username: name,
							pub: pub,
							key: key,
						});
					});
			}
		});
	requests.set(reqs);
}
