<script>
	// @ts-nocheck

	import Icon from "$atoms/Icon.svelte";
	import Text from "$atoms/Text.svelte";
	import { onMount, onDestroy } from "svelte";
	import Button from "$atoms/Button.svelte";
	import File from "$atoms/File.svelte";
	import Trash from "$molecules/Trash.svelte";
	import ShareModal from "$organisms/ShareModal.svelte";
	import { getFile, deleteFile, uploading, downloading } from "$lib/cloud.js";
	import { addToast, uploadQueue, downloadQueue } from "$lib/store.js";
	import { user } from "$lib/db.js";
	import { uriToFile } from "$lib/helper.js";
	export let name;
	export let folder;

	let data = null;
	let dataType;

	const downloadStarted = () => {
		addToast({
			message: `Downloading Started ...`,
			type: "info",
			dismissible: true,
			timeout: 700,
		});
	};
	onMount(async () => {
		dataType = await user.get(folder).get(name).get("type");
	});

	async function download() {
		getFile(folder, name);
	}
</script>

<File {name} type={dataType}>
	<div class="flex flex-row space-x-2" />
	<ShareModal {folder} title={name} />

	<Trash
		{folder}
		file={name}
		title="Are you sure you want to trash this file?"
		cancel="Cancel"
		message={`${name} will be stored in the trash folder for 30 days and will be removed after that`}
	/>

	<Button
		left="download"
		variant="text"
		on:click={() => {
			download();
			downloadStarted();
		}}
	/>
</File>
