
<script>
    export let sidebarOpen = false;
</script>

<aside
		class={`fixed inset-y-0 left-0 z-40 mt-12 w-64 transform bg-white shadow-md transition-transform duration-300 ease-in-out md:relative md:mt-0 md:translate-x-0
		${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
	>
		<div class="p-6">
			<nav class="mt-8 space-y-4">
				<!-- <a href="/" class="block font-medium text-gray-700 hover:text-indigo-600">🏠 Home</a> -->
				
				<a href="/" class="block font-medium text-gray-700 hover:text-indigo-600">✈️ Air import</a>

				<a href="/LocalSupplier" class="block font-medium text-gray-700 hover:text-indigo-600">
					🧺 Local Order
				</a>
				<a href="/ContainerImport" class="block font-medium text-gray-700 hover:text-indigo-600">
					🚢 Container Import
				</a>


				<a href="/products" class="block font-medium text-gray-700 hover:text-indigo-600"
					>📦 Products</a
				>
				<a href="/shipments" class="block font-medium text-gray-700 hover:text-indigo-600"
					>🚚 Shipments</a
				>
				<a href="/reports" class="block font-medium text-gray-700 hover:text-indigo-600"
					>📊 Reports</a
				>
				
				<!-- <a href="/settings" class="block font-medium text-gray-700 hover:text-indigo-600">
					⚙️ Settings
				</a> -->
			</nav>
		</div>
	</aside>