<script>
	let isOpen = false;
</script>

<nav class="bg-blue-400">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<div class="flex justify-between items-center h-16">
			
			<a href="/" class="text-white font-bold text-2xl tracking-wide">TradeTally</a>

			<!-- Desktop Nav -->
			<div class="hidden md:flex space-x-8 text-white font-medium">
				<a href="/" class="hover:text-yellow-300 transition">Home</a>
				<a href="/about" class="hover:text-yellow-300 transition">About</a>
				<a href="/contact" class="hover:text-yellow-300 transition">Contact Us</a>
			</div>

			<!-- Mobile Menu Button -->
			<div class="md:hidden">
				<button on:click={() => isOpen = !isOpen} class="text-white focus:outline-none">
					<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						{#if isOpen}
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
						{:else}
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
						{/if}
					</svg>
				</button>
			</div>
		</div>
	</div>

	<!-- Mobile Menu -->
	{#if isOpen}
		<div class="md:hidden bg-blue-300 px-4 pt-2 pb-4 space-y-2 text-white font-medium">
			<a href="/" class="block hover:text-yellow-300">Home</a>
			<a href="/about" class="block hover:text-yellow-300">About</a>
			<!-- <a href="/contact" class="block hover:text-yellow-300">Contact Us</a> -->
		</div>
	{/if}
</nav>
