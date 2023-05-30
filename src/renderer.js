import "./css/int.css";
import "./index.css";

import "cropperjs/dist/cropper.css";
import Cropper from "cropperjs";

let cropper;
function cropperInit() {
  const image = document.getElementById("image");
  cropper = new Cropper(image, {
    aspectRatio: 1 / 1,
    backgroundColor: "gray",
    crop(event) {
      // console.log(event.detail.x);
      // console.log(event.detail.y);
      // console.log(event.detail.width);
      // console.log(event.detail.height);
      // console.log(event.detail.rotate);
      // console.log(event.detail.scaleX);
      // console.log(event.detail.scaleY);
    },
  });
}

$("#size_big").click(() => {
  cropper.zoom(0.1);
});
$("#size_mini").click(() => {
  cropper.zoom(-0.1);
});

$("#extend").click(() => {
  cropper
    .getCroppedCanvas({
      fillColor: "#fff",
      imageSmoothingEnabled: false,
      imageSmoothingQuality: "high",
    })
    .toBlob((blob) => {
      var downloadLink = document.createElement("a");
      downloadLink.href = URL.createObjectURL(blob);
      // 设置下载文件的名称
      downloadLink.download = `${new Date().getTime()}_shop.png`;
      // 添加 <a> 元素到文档中
      document.body.appendChild(downloadLink);
      // 模拟点击下载链接
      downloadLink.click();
    });
});

$("#fileImages").on("change", function (event) {
  // 获取用户选择的文件
  var files = event.target.files;
  // 创建 FileList 对象
  var blob = URL.createObjectURL(files[0]);
  // 将文件读取为 DataURL 格式
  console.log(blob);

  $("#image").attr("src", blob);
  $("#image").on("load", () => {
    console.log("Image loaded!");
    if (cropper != null) {
      cropper.destroy();
    }
    cropperInit();
  });

  for (var i = 0; i < files.length; i++) {
    console.log("File name:", files[i].name);
    console.log("File size:", files[i].size);
    console.log("File type:", files[i].type);
    // fileList.append(files[i]);
  }

  // 将 FileList 对象转换为 URL
  // var url = URL.createObjectURL(fileList);
});
