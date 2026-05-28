<script>
  let { filter = 'all', onFilterChange } = $props()
</script>

<div class="chips">
  <button
    class="chip"
    class:active={filter === 'all'}
    onclick={() => onFilterChange?.('all')}
  >Alle</button>

  <button
    class="chip"
    class:active={filter === 'bar'}
    onclick={() => onFilterChange?.('bar')}
  >
    <img src="/assets/shot_full.png" alt="" class="chip-icon" />
    Bars & Clubs
  </button>

  <button
    class="chip"
    class:active={filter === 'retail'}
    onclick={() => onFilterChange?.('retail')}
  >
    <img src="/assets/bottle_full.png" alt="" class="chip-icon" />
    Geschäfte
  </button>
</div>

<style>
  .chips {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }

  .chip {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 6px 14px;
    border-radius: 999px;
    border: none;
    background: #fff;
    color: #444;
    font-family: inherit;
    font-size: 0.85rem;
    font-weight: 500;
    cursor: pointer;
    box-shadow: 0 1px 6px rgba(0,0,0,0.14);
    transition: background 0.15s, color 0.15s;
    white-space: nowrap;
  }

  .chip:hover { background: #fef9ec; }

  .chip.active {
    background: var(--color-primary);
    color: #fff;
    box-shadow: 0 1px 8px rgba(236,172,0,0.35);
  }

  .chip-icon {
    width: 18px;
    height: 18px;
    object-fit: contain;
  }
</style>
