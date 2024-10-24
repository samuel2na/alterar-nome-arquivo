const fileInput = document.getElementById("fileInput");
const fileCountDiv = document.getElementById("fileCount");
const prefixInput = document.getElementById("prefixInput");
const nroInicial = document.getElementById("nroInicial");
const renameOptions = document.getElementsByName("renameOption");
const extensao = document.getElementById("extensao");

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
      return renameOptions[i].value;
    }
  }
}

function clearRadio(e){
  let chek = e.target.value;
  if (chek == "sequential") { prefixInput.value = ""; }
  else if(chek == "prefix") { nroInicial.value = ""; };
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

  let seq = 0;
  if (selectedOption === "sequential" && nroInicial.value != ""){
    seq = parseInt(nroInicial.value,10) - 1;
  }

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    let newName, newExtensao;

    if (extensao.value != "") {
      console.log(extensao.value);
      newExtensao = "." + extensao.value.replace(".", "");
      console.log(newExtensao);
    } else {
      newExtensao = `${file.name.substring(file.name.lastIndexOf("."))}`;
    }

    if (selectedOption === "prefix") {
      newName = `${prefix}${i + 1}${newExtensao}`;
    } 
    else if (selectedOption === "sequential") {
      newName = `${seq + 1}${newExtensao}`;
    }

    seq += 1;

    nroInicial.value = "";
    prefixInput.value = "";

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
