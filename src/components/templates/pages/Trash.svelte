<script>
	import Text from "$atoms/Text.svelte";
	import UploadModal from "$organisms/UploadModal.svelte";
	import FileList from "$organisms/FileList.svelte";
	let value;
	let ttl = 3600 * 30;
</script>

<div class="w-full flex py-4 px-2 flex-row items-center justify-start">
	<div class="w-full pr-4 lg:w-1/2">
		<Text type=" title ">Trash</Text>
	</div>
</div>
<div class="flex-1 h-full px-2 lg:px-10 py-4 rounded-lg">
	<FileList folder={`trash<?${ttl}`} />
</div>
