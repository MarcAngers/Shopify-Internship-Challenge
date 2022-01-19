const NASA = "https://api.nasa.gov/planetary/apod";
const YOUTUBE = "https://i3.ytimg.com/vi/"
const API_KEY = "ihgd8gabFuIQjZVbRejavE0d0uwa3MQSPLaiMBG4";

var today = new Date();
var viewing = new Date();
var imagewrapper;
var image;

window.addEventListener('load', function() {
    imagewrapper = document.getElementById("image-wrapper");
    imagewrapper.addEventListener('dblclick', function() {
        toggleLike();
    });

    image = document.getElementById("image");
    image.addEventListener('load', function() {
        imagewrapper.classList.toggle("loading");
        imagewrapper.classList.remove("hidden");
    });

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
    let imagetitle = document.getElementById("image-title");
    let imagedescription = document.getElementById("image-description");
    let imagedate = document.getElementById("image-date");

    $.ajax({
        type: "GET",
        url: NASA + "?api_key=" + API_KEY + "&date=" + parseDate(viewing),
        success: function(data) {
            imagewrapper.classList.toggle("loading");
            setTimeout(() => { 
                if (data.media_type == "video")
                    image.src = YOUTUBE + getVideoID(data.url) + "/maxresdefault.jpg";
                else
                    image.src = data.url;
                imagetitle.innerText = data.title;
                imagedescription.innerText = data.explanation;
                imagedate.innerText = data.date;

                checkLikes();
            }, 300);
        },
        error: function(e) {
            console.error(e);
        }
    });
}

function toggleLike() {
    let likewrapper = document.getElementById("like-wrapper");
    let unlikewrapper = document.getElementById("unlike-wrapper");
    let d = parseDate(viewing);

    if (imagewrapper.classList.contains("liked")) {
        likewrapper.classList.toggle("active");
        unlikewrapper.classList.toggle("not-shown");
        unlikewrapper.classList.toggle("active");
        setTimeout(() => {
            unlikewrapper.classList.toggle("not-shown");
            localStorage.setItem(d, "unliked");
            imagewrapper.classList.toggle("liked");
        }, 740);
    } else {
        unlikewrapper.classList.toggle("active");
        likewrapper.classList.toggle("not-shown");
        likewrapper.classList.toggle("active");
        setTimeout(() => {
            likewrapper.classList.toggle("not-shown");
            localStorage.setItem(d, "liked");
            imagewrapper.classList.toggle("liked");
        }, 740);
    }
}

function checkLikes() {
    d = parseDate(viewing);
    let liked = localStorage.getItem(d);
    let likewrapper = document.getElementById("like-wrapper");
    let unlikewrapper = document.getElementById("unlike-wrapper");
    
    if (liked != "liked" && imagewrapper.classList.contains("liked")) {
        imagewrapper.classList.remove("liked");
        unlikewrapper.classList.toggle("active");
        likewrapper.classList.toggle("active");
    }
    if (liked == "liked" && !imagewrapper.classList.contains("liked")) {
        imagewrapper.classList.add("liked");
        unlikewrapper.classList.toggle("active");
        likewrapper.classList.toggle("active");
    }
}               

function parseDate(d) {
    let day = d.getDate();
    let month = d.getMonth() + 1;
    let year = d.getFullYear();

    return year + "-" + month + "-" + day;
}

function getVideoID(v) {
    return v.substring(v.lastIndexOf("/") + 1, v.lastIndexOf("?"));
}