<script>
	// @ts-nocheck

	import Button from "$atoms/Button.svelte";
	import Text from "$atoms/Text.svelte";
	import Modal from "$molecules/Modal.svelte";
	import Form from "$molecules/Form.svelte";
	import { sendRequest } from "$lib/friend.js";
	import { addToast } from "$lib/store";

	let addFreind = [
		{
			name: "pub",
			id: "pub",
			type: "text",
			value: "",
			placeholder: "Your Friend's Address",
			inputType: "text",
			inputIcon: "at",
		},
	];
	const requestSent = () => {
		addToast({
			message: `Request has been sent`,
			type: "success",
			dismissible: true,
			timeout: 700,
		});
	};
	let modal;
</script>

<Modal bind:this={modal}>
	<Button
		left="addFriend"
		on:click={() => {
			modal.show();
		}}
		variant="text"
	/>
	<div
		class="flex flex-row justify-between items-center px-2 py-2"
		slot="header"
	>
		<Text type=" title ">Add Friend</Text>
		<Button
			left="close"
			on:click={() => {
				modal.hide();
			}}
			variant="text"
		/>
	</div>
	<div
		slot="footer"
		class="w-full flex flex-col items-center  justify-center"
	>
		<Form
			pos="center"
			icon="addFriend"
			submitValue="Add Friend"
			onSubmit={({ pub }) => {
				// create(username);
				sendRequest(pub);
				modal.hide();
				requestSent();
			}}
			fields={addFreind}
		/>
	</div>
</Modal>
