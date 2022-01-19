const NASA = "https://api.nasa.gov/planetary/apod";
const YOUTUBE = "https://img.youtube.com/vi/"
const API_KEY = "ihgd8gabFuIQjZVbRejavE0d0uwa3MQSPLaiMBG4";

var today = new Date();
var viewing = new Date();

window.addEventListener('load', function() {
    loadNewImage();
}, false);

window.addEventListener('wheel', function(e) {
    if (e.deltaY < 0 && +viewing !== +today) {
        viewing.setDate(viewing.getDate() + 1);
    } else if (e.deltaY > 0) {
        viewing.setDate(viewing.getDate() - 1);
    }
    loadNewImage();
});

function loadNewImage() {
    let imagewrapper = document.getElementById("image-wrapper");
    let image = document.getElementById("image");
    let imagetitle = document.getElementById("image-title");
    let imagedescription = document.getElementById("image-description");
    let imagedate = document.getElementById("image-date");

    $.ajax({
        type: "GET",
        url: NASA + "?api_key=" + API_KEY + "&date=" + parseDate(viewing),
        success: function(data) {
            console.log(data);
            imagewrapper.classList.toggle("loading");
            setTimeout(() => { 
                if (data.media_type == "video")
                    image.src = YOUTUBE + "RtDSxi-D4KA/default.jpg";
                else
                    image.src = data.url;
                imagetitle.innerText = data.title;
                imagedescription.innerText = data.explanation;
                imagedate.innerText = data.date;
                imagewrapper.classList.toggle("loading"); 
            }, 300);
        },
        error: function(e) {
            console.error(e);
        }
    });
}

function parseDate(d) {
    let day = d.getDate();
    let month = d.getMonth() + 1;
    let year = d.getFullYear();

    return year + "-" + month + "-" + day;
}