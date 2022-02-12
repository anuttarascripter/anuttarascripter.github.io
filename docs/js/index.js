const clog = console.log;
clog("hello github");

const header = document.getElementById("header");
// header.style = `
// margin: 0;
// padding: 50px;
// `;

const divMain = document.getElementById("div-main");
for (const section of sections) {
  const divSection = document.createElement("div");
  const heading = document.createElement("h3");
  heading.innerHTML = `${section.title}`;
  divSection.appendChild(heading);

  const ol = document.createElement("ol");
  for (const item of section.items) {
    const li = document.createElement("li");
    li.innerHTML = `<a href="/viewer.html?item=${section.title}/${item}">${item}</a>`;
    ol.appendChild(li);
  }
  divSection.appendChild(ol);

  divSection.classList.add("div-section");
  // divSection.className = "div-section";
  divMain.appendChild(divSection);
}
