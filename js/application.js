var urlContainer = $('#url-container');
var uploadedStatus = $('#uploaded-status');
var clipboardButton = $('#copy-to-clipboard-button');
var resultForm = $('.uploaded-file-link-container');
var pageTitle = $('.page-hint');
var uploadingBarContainer = $('.uploading-bar-container');

var shortenUrlCount = 0;

function startUploadingAction(file) {

    pageTitle.html("UPLOADING YOUR FILE");

    hideResultForm();
    setUploaingProgress(0);
    uploadingBarContainer.show();

    var formData = new FormData;
    formData.append('file', file);

    $.ajax({
        xhr: function () {
            var xhr = new window.XMLHttpRequest();
            xhr.upload.addEventListener("progress", function (evt) {
                if (evt.lengthComputable) {
                    setUploaingProgress(evt.loaded / evt.total);
                }
            }, false);

            return xhr;
        },

        type: "POST",
        url: "http://api.files.grakovne.org/api/v1/files/",
        data: formData,
        processData: false,
        contentType: false,
        success: function (data) {
            shortenUrlCount++;

            setDoneToStatus();
            setUrlToEdit(buildDownloadingUrl(data['body']['hash']));
            showCopyToClipBoardButton();
        }
    });

}

$("*").on({
    'dragover dragenter': function (e) {
        e.preventDefault();
        e.stopPropagation();
    },
    'drop': function (e) {
        var dataTransfer = e.originalEvent.dataTransfer;

        if (dataTransfer && dataTransfer.files.length) {
            e.preventDefault();
            e.stopPropagation();

            console.log(dataTransfer.files);
            startUploadingAction(dataTransfer.files[0])
        }
    }
});

function copyShortenUrlToClipBoard() {
    urlContainer.select();
    document.execCommand("Copy");
}

clipboardButton.click(function (e) {
    copyShortenUrlToClipBoard();
});

function setDoneToStatus() {
    pageTitle.html("TAKE YOUR LINK");

    showResultForm();
    uploadingBarContainer.hide();
    uploadedStatus.css('color', 'white');
    uploadedStatus.addClass("label-success", 1000);
    uploadedStatus.html("<span class=\"glyphicon glyphicon-ok\"></span>");
}

function setUrlToEdit(url) {
    urlContainer.val(url)
}

function buildDownloadingUrl(hash) {
    var urlPrefix = location.protocol + '//' + location.hostname + '/';
    return urlPrefix + hash;
}


function initViews() {
    hideResultForm();
    uploadingBarContainer.hide();
}

function setUploaingProgress(progress) {
    $("#uploading-bar-child").css("width", progress * 100 + "%");
}

function hideResultForm() {
    resultForm.hide();
}

function showResultForm() {
    resultForm.show();
}

initViews();




