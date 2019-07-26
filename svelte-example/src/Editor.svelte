<script>
  export let editorState
  console.log(editorState)
</script>

<div>
  {#each editorState.tree.blocks as block}
    <div>{block.value.map(v => v.char).join('')}</div>
  {/each}
</div>