const fileInput = document.getElementById("fileInput");
const fileCountDiv = document.getElementById("fileCount");
const prefixInput = document.getElementById("prefixInput");
const renameOptions = document.getElementsByName("renameOption");

fileInput.addEventListener("change", function () {
  const files = fileInput.files;
  if (files.length > 0) {
    fileCountDiv.textContent = `${files.length} arquivo(s) selecionado(s).`;
  } else {
    fileCountDiv.textContent = "Nenhum arquivo selecionado.";
  }
});

function getSelectedRenameOption() {
  for (let i = 0; i < renameOptions.length; i++) {
    if (renameOptions[i].checked) {
      if(renameOptions[i].value == "sequential") { prefixInput.value = ""; };
      return renameOptions[i].value;
    }
  }
}

function clearRadio(){
  prefixInput.value = "";
}

function renameFiles() {
  const files = fileInput.files;
  const selectedOption = getSelectedRenameOption();
  
  if(files.length == 0){ alert("Selecione algum arquivo para renomear!"); return; }
  if (selectedOption === "prefix" && prefixInput.value == "") {
    alert("A opção 'Usar Prefixo' está marcada, mas não há prefixo informado!"); return; 
  }

  const zip = new JSZip(); // Usando a biblioteca JSZip para criar um ZIP
  const prefix = prefixInput.value || "arquivo_";

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    let newName;

    if (selectedOption === "prefix") {
      newName = `${prefix}${i + 1}${file.name.substring(
        file.name.lastIndexOf(".")
      )}`;
    } else if (selectedOption === "sequential") {
      newName = `${i + 1}${file.name.substring(file.name.lastIndexOf("."))}`;
    }

    zip.file(newName, file);
  }

  zip.generateAsync({ type: "blob" }).then(function (content) {
    const link = document.createElement("a");
    link.href = URL.createObjectURL(content);
    link.download = "arquivos_renomeados.zip";
    link.click();
    fileCountDiv.textContent = "Nenhum arquivo selecionado.";
  });
}
