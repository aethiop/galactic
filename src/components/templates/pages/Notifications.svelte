<script>
	import Text from "$atoms/Text.svelte";
	import Button from "$atoms/Button.svelte";
	import TextInput from "$atoms/TextInput.svelte";
	import { onMount } from "svelte";
	import RequestList from "$organisms/RequestList.svelte";
	// import { getRequests } from "$lib/friend.js";
	let value;
	onMount(() => {
		// getRequests();
	});
</script>

<div class="w-full flex py-4 px-2 flex-row items-center justify-start">
	<Text type=" title ">Notifications</Text>
</div>
<RequestList />
<!-- <div class="w-full flex py-4 px-2 flex-row items-center justify-end">
	<div class="w-full pr-4 lg:w-1/2">
		<TextInput
			placeholder="Search..."
			name="Search"
			icon="search"
			bind:value
		/>
	</div>
</div>
<div class="w-full  h-full flex justify-center items-center rounded-lg">
	<Text>No notifications here...[Coming Soon]</Text>
</div> -->
