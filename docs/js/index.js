const clog = console.log;
clog("hello github");

const header = document.getElementById("header");
header.style = `
margin: 0;
padding: 50px;
background-image: url(/img/LDI.jpg);
background-repeat: no-repeat;
background-size: cover;
height: 50px;
line-height: 50px;
`;

const sections = [
  { title: "script-1", items: ["text.txt", "text.txt", "text.txt"] },
  { title: "script-2", items: ["text.txt", "text.txt"] },
];

const divMain = document.getElementById("div-main");
for (const section of sections) {
  const heading = document.createElement("h3");
  heading.innerHTML = `${section.title}`;
  heading.style = `margin-top: 50px;`;
  divMain.appendChild(heading);

  const ol = document.createElement("ol");
  for (const item of section.items) {
    const li = document.createElement("li");
    li.innerHTML = `<a href="/txt/${item}">${item}</a>`;
    ol.appendChild(li);
  }
  divMain.appendChild(ol);
}
