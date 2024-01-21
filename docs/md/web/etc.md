<p style="text-align: right">2024-01-21</p>

## file upload

```js
btn_upload.onclick = async () => {
  console.log("[upload]");
  let input = document.createElement("input");
  input.type = "file";
  input.accept = "image/*";
  input.onchange = async (evt) => {
    let file = input.files[0];
    console.log({ evt, file });
    await upload(file, 12);
  };
  input.click();

  async function upload(file, fileId) {
    let formData = new FormData();
    formData.append("file", file);
    formData.append("fileId", fileId);

    const res = await axios({
      method: "post",
      url: `${API_URL}/upload-image`,
      headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
      data: formData,
    });
    const data = res.data;
    console.log({ data });
  }
};
```
