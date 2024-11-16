const form = document.querySelector('.js-form');
const nameInput = form.querySelector('.js-field[name="name"]');
const birthDateInput = form.querySelector('.js-field[name="birth-date"]');
const idInput = form.querySelector('.js-field[name="id"]');
const tableBody = document.querySelector('.js-table');
let pessoas = obterPessoas();

form.addEventListener('submit', (event) => {
    event.preventDefault();    

    const pessoa = {
        name: nameInput.value,
        birthDate: formatarData(birthDateInput.value),
    };

    salvarPessoa(pessoa);
    limparFormulario();
    atualizarTabela();
});

/*
Um nome precisa ter no mínimo três letras.
Um nome pode ter no máximo 120 letras.
Um nome pode apenas conter letras, e não números.
*/
nameInput.addEventListener('input', function() {
    const value = nameInput.value;
    
    if (!value) {
        nameInput.setCustomValidity("O campo é obrigatório.");
    } else if (value.length < 3) {
        nameInput.setCustomValidity("Um nome precisa ter no mínimo três letras.");
    } else if (value.length > 120) {
        nameInput.setCustomValidity("Um nome pode ter no máximo 120 letras.");    
    } else if (!/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/.test(value)) {
        nameInput.setCustomValidity("O nome deve conter apenas letras e espaços.");
    } else {
      nameInput.setCustomValidity('');
    }
});
/*
A data de nascimento precisa estar no formato DD/MM/AAAA, por exemplo: 31/01/2021.
O mês informado deve estar entre 01 e 12.
*/
birthDateInput.addEventListener('input', function() {
    const value = formatarData(birthDateInput.value);
    // console.log(value);
    
    if (!value) {
        birthDateInput.setCustomValidity("O campo é obrigatório.");
    } else if (!value.match(/^\d{2}\/\d{2}\/\d{4}$/)) {
        birthDateInput.setCustomValidity("A data de nascimento precisa estar no formato DD/MM/AAAA, por exemplo: 31/01/2021.");
    } else {
        const [day, month, year] = value.split("/").map(Number);

        if (month < 1 || month > 12) {
            birthDateInput.setCustomValidity("O mês informado deve estar entre 01 e 12.");
        } else if (day < 1 || day > 31) {
            birthDateInput.setCustomValidity("O dia informado deve estar entre 01 e 31.");
        } else {
            birthDateInput.setCustomValidity('');
        }
    }
});

function exibirPessoa(pessoa) {
    console.log(`Nome: ${pessoa.name}`);
    console.log(`Data de nascimento: ${pessoa.birthDate}`);
}

function exibirPessoas() {
    if (pessoas && pessoas.length > 0) {
        pessoas.forEach(exibirPessoa);
    }
}

function editarPessoa(index) {
    const pessoa = pessoas[index];

    nameInput.value = pessoa.name;
    birthDateInput.value = pessoa.birthDate.split("/").reverse().join("-");
    idInput.value = index;
}

function removerPessoa(index) {
    pessoas.splice(index, 1);
    localStorage.setItem('pessoas', JSON.stringify(pessoas));

    atualizarTabela();
}

function atualizarTabela() {
    tableBody.innerHTML = '';

    pessoas.forEach((pessoa) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${pessoa.name}</td>
            <td>${pessoa.birthDate}</td>
            <td class="actions">
                <button class="button-edit" type="button" onclick="editarPessoa(${pessoas.indexOf(pessoa)})">Editar</button>
                <button class="button-delete" type="button" onclick="removerPessoa(${pessoas.indexOf(pessoa)})">Remover</button>
            </td>
        `;

        tableBody.appendChild(row);
    });
}

function limparFormulario() {
    nameInput.value = '';
    birthDateInput.value = '';
}

function formatarData(data) {
    const [year, month, day] = data.split("-");
    const formattedDate = `${day}/${month}/${year}`;
    
    return formattedDate
}

function salvarPessoa(pessoa) {
    if (!pessoas) {
        pessoas = [];
    }

    if (idInput.value) {
        pessoas[idInput.value] = pessoa;
    } else {
        pessoas.push(pessoa);
    }
    
    localStorage.setItem('pessoas', JSON.stringify(pessoas));
}

function obterPessoas() {
    const pessoas = JSON.parse(localStorage.getItem('pessoas')) ?? [];

    return pessoas;
}

atualizarTabela();