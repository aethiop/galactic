<script>
	// @ts-nocheck

	import TextInput from "$atoms/TextInput.svelte";
	import Public from "$organisms/Public.svelte";
	import Shared from "$templates/pages/Shared.svelte";
	import Friends from "$templates/pages/Friends.svelte";
	import Trash from "$templates/pages/Trash.svelte";
	import HomeTabs from "$organisms/HomeTabs.svelte";
	import Notifications from "$templates/pages/Notifications.svelte";
	import Cloud from "$templates/pages/Cloud.svelte";

	import HomeHeader from "$organisms/HomeHeader.svelte";

	let items = [
		{
			name: "Cloud",
			icon: "cloud",
			value: 1,
			component: Cloud,
		},
		{
			name: "Notifications",
			icon: "notification",
			value: 2,
			component: Notifications,
		},

		{
			name: "Shared",
			icon: "share",
			value: 3,
			component: Shared,
		},
		{
			name: "Friends",
			icon: "friends",
			value: 4,
			component: Friends,
		},
		{
			name: "Trash",
			icon: "trash",
			value: 5,
			component: Trash,
		},
	];
</script>

<div class="w-full sm:w-full h-screen flex flex-row">
	<HomeTabs {items} />
</div>
