<script>
  import Home from './views/Home.svelte'
  import Admin from './views/Admin.svelte'

  // Simple hash-based routing — no dependency needed
  let route = $state(window.location.pathname)

  // Update route on popstate (browser back/forward)
  $effect(() => {
    const handler = () => { route = window.location.pathname }
    window.addEventListener('popstate', handler)
    return () => window.removeEventListener('popstate', handler)
  })
</script>

{#if route === '/admin'}
  <Admin />
{:else}
  <Home />
{/if}
