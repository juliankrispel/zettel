<script>
  export let editorState
  console.log(editorState)
  const style = {
    WebkitUserModify: 'read-write-plaintext-only',
    position: 'relative',
    whiteSpace: 'pre-wrap',
    overflowWrap: 'break-word',
  }
</script>

<div>
  {#each editorState.tree.blocks as block}
    <div style={style}>{block.value.map(v => v.char).join('')}</div>
  {/each}
</div>