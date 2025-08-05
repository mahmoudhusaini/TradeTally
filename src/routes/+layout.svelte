<script lang="ts">
	import '../app.css';
	import Nav from '../Components/Nav.svelte';
	import SideBar from '../Components/SideBar.svelte';

	// let { children } = $props();

	let sidebarOpen: boolean = false;
</script>

<div class="flex h-screen overflow-hidden bg-gray-100">
	<!-- Sidebar -->
	<SideBar {sidebarOpen} />

	<!-- Content Wrapper -->
	<div class="flex w-0 flex-1 flex-col overflow-hidden">
		<!-- Mobile Top Bar -->
		<header class="flex items-center justify-between bg-white p-4 shadow md:hidden">
			<button
				on:click={() => (sidebarOpen = !sidebarOpen)}
				class="text-xl text-gray-500 hover:text-indigo-600"
			>
				{sidebarOpen ? '✖' : '☰'}
			</button>
			<h2 class="text-lg font-semibold text-gray-700">Dashboard</h2>
		</header>

		<!-- Header / Toolbar -->
		<header class="hidden items-center justify-between bg-white px-6 py-4 shadow md:flex">
			<div>
				<h2 class="text-2xl font-semibold text-gray-800">Welcome back 👋</h2>
				<p class="text-sm text-gray-500">Here's your activity today</p>
			</div>
			<div class="flex items-center gap-4">
				<span class="text-gray-600">TradeTally</span>
				<img
					src="/assets/images/tradetally-profile.jpg"
					alt="Avatar"
					class="h-10 w-10 rounded-full border"
				/>
			</div>
		</header>

		<!-- Main Content -->
		<main class="flex-1 overflow-y-auto px-4 py-6 sm:px-6 md:px-8">
			<slot />
		</main>
	</div>
</div>

<!-- {@render children()} -->
