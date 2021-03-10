<script lang="ts">
  import {
    createEventDispatcher,
    onDestroy,
    onMount
  } from 'svelte';

  import * as ace from 'brace';

  // Languages
  import 'brace/mode/c_cpp';
  import 'brace/mode/javascript';
  import 'brace/mode/python';
  import 'brace/mode/rust';

  // Themes
  import 'brace/theme/chrome';
  import 'brace/theme/github';
  import 'brace/theme/monokai';
  import 'brace/theme/xcode';

  export let code: string = '';
  export let lang: string = 'python';
  export let theme: string = 'xcode';

  const dispatch = createEventDispatcher();

  let editor: ace.Editor;
  let editorElement;
  let codeBackup: string = '';

  $: watchCode(code);
  function watchCode(newCode: string) {
    if (codeBackup !== newCode && editor && typeof newCode === 'string') {
      editor.session.setValue(newCode);

      codeBackup = newCode;
    }
  }

  $: watchLang(lang);
  function watchLang(newLang: any) {
    if (editor) {
      editor.getSession().setMode('ace/mode/' + newLang);
    }
  }

  $: watchTheme(theme);
  function watchTheme(newTheme: string) {
    if (editor) {
      editor.setTheme('ace/theme/' + newTheme);
    }
  }

  onMount(() => {
    editor = ace.edit(editorElement);

    dispatch('init', editor);

    codeBackup = code;

    editor.$blockScrolling = Infinity;

    editor.setValue(code, 1);
    editor.getSession().setMode('ace/mode/' + lang);
    editor.setTheme('ace/theme/' + theme);

    editor.onBlur = () => dispatch('blur');
    editor.onChangeMode = event => dispatch('changeMode', event);
    editor.onCommandKey = (event, hashId, keyCode) => dispatch('commandKey', { event, hashId, keyCode });
    editor.onCopy = () => dispatch('copy');
    editor.onCursorChange = () => dispatch('cursorChange');
    editor.onCut = () => dispatch('cut');
    editor.onDocumentChange = (event: { data: any }) => dispatch('documentChange', event);
    editor.onFocus = () => dispatch('focus');
    editor.onPaste = text => dispatch('paste', text);
    editor.onSelectionChange = event => dispatch('selectionChange', event);

    editor.on('change', () => {
      code = editor.getValue();
      codeBackup = code;

      dispatch('change', code);
    });
  });

  onDestroy(() => {
    if (editor) {
      editor.destroy();
      editor.container.remove();
    }
  });
</script>

<div id="app">
  <div class="script">
    <div class="editor" bind:this={editorElement}></div>
  </div>
</div>

<style>
  #app {
    display: flex;
    flex-flow: column nowrap;
    height: 100vh;
    overflow: hidden;
  }

  .script {
    width: 100%;
    height: 100%;
    position: relative;
    background-color: transparent;
    overflow: auto;
  }

  .script > .editor {
    position: absolute;
    left: 0px;
    right: 0px;
    top: 0px;
    bottom: 0px;
    margin: 0px;
    padding: 0px;
  }
</style>
