// Лабораторна робота №5, варіант 6

// ===================== Завдання 1 =====================

// Регулярні вирази для полів варіанту 6 (Т — текст, Ч — число)
const rules = {
    // ТТТТТТ Т.Т. — прізвище з великої літери, пробіл, два ініціали з крапками
    fullName: /^[А-ЯІЇЄҐ][а-яіїєґ']+ [А-ЯІЇЄҐ]\.[А-ЯІЇЄҐ]\.$/,

    // ЧЧ.ЧЧ.ЧЧЧЧ — день 01–31, місяць 01–12, рік 1900–2099
    birthDate: /^(0[1-9]|[12]\d|3[01])\.(0[1-9]|1[0-2])\.(19|20)\d{2}$/,

    // м. ЧЧЧЧЧЧ — «м.», пробіл і шість цифр
    address: /^м\. \d{6}$/,

    // тттттт@ттттт.com — малі латинські літери, домен .com
    email: /^[a-z]+@[a-z]+\.com$/,

    // @Т_ТТТТТ — «@», літера, підкреслення, літери
    telegram: /^@[A-Za-z]_[A-Za-z]+$/
};

const labels = {
    fullName: "ПІБ",
    birthDate: "Дата народж.",
    address: "Адреса",
    email: "e-mail",
    telegram: "Telegram"
};

const form = document.getElementById("student-form");
let submittedOnce = false;

// Перевіряє одне поле та виділяє його рядок, якщо є помилка
function validateField(name) {
    const input = document.getElementById(name);
    const row = form.querySelector('.form-row[data-field="' + name + '"]');
    const isValid = rules[name].test(input.value.trim());
    row.classList.toggle("invalid", !isValid);
    return isValid;
}

// Відкриває окреме вікно з введеними даними
function showResultWindow(data) {
    const win = window.open("", "_blank", "width=520,height=380");

    // Якщо браузер заблокував спливне вікно — показуємо дані в alert
    if (!win) {
        const text = Object.keys(data)
            .map(function (key) { return labels[key] + ": " + data[key]; })
            .join("\n");
        alert("Введені дані:\n\n" + text);
        return;
    }

    const doc = win.document;
    doc.title = "Введені дані";
    doc.body.style.fontFamily = "Arial, sans-serif";
    doc.body.style.margin = "20px";

    const heading = doc.createElement("h2");
    heading.textContent = "Введені дані";
    doc.body.appendChild(heading);

    const table = doc.createElement("table");
    table.style.borderCollapse = "collapse";

    Object.keys(data).forEach(function (key) {
        const tr = doc.createElement("tr");
        const th = doc.createElement("th");
        const td = doc.createElement("td");
        th.textContent = labels[key];
        td.textContent = data[key]; // textContent — без вставки HTML з полів
        [th, td].forEach(function (cell) {
            cell.style.border = "1px solid #999";
            cell.style.padding = "6px 12px";
            cell.style.textAlign = "left";
        });
        tr.appendChild(th);
        tr.appendChild(td);
        table.appendChild(tr);
    });

    doc.body.appendChild(table);
}

form.addEventListener("submit", function (event) {
    event.preventDefault();
    submittedOnce = true;

    let allValid = true;
    Object.keys(rules).forEach(function (name) {
        if (!validateField(name)) {
            allValid = false;
        }
    });

    if (allValid) {
        const data = {};
        Object.keys(rules).forEach(function (name) {
            data[name] = document.getElementById(name).value.trim();
        });
        showResultWindow(data);
    }
});

// Після першої спроби відправки — перевірка «на льоту» під час введення
Object.keys(rules).forEach(function (name) {
    document.getElementById(name).addEventListener("input", function () {
        if (submittedOnce) {
            validateField(name);
        }
    });
});