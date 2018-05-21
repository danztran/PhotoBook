(function() {
  function updateTimelineItems(event, firstRun) {
    var top = 0;
    var bottom = window.innerHeight;

    [].slice.call(document.querySelectorAll('.fs-timeline-item')).forEach(function(element, i) {
      var rect = element.getBoundingClientRect();
      if (rect.bottom >= top && rect.top <= bottom) {
        if (firstRun === true) {
          setTimeout(function() {
            this.classList.add('is-visible');
          }.bind(element), i * 120);
        } else {
          element.classList.add('is-visible');
        }
      } else {
        element.classList.remove('is-visible');
      }
    });
  }
  window.addEventListener('resize', updateTimelineItems);
  window.addEventListener('scroll', updateTimelineItems);
  updateTimelineItems(null, true);

  $('#dateUpload').val(new Date().toISOString().substr(0, 10));
})();

$('#imgUpload').change(function() {
    loadImage(this);
});

function loadImage(input){
  $(input).parent().find("img.img-preview").fadeOut('fast');
  if (input.files && input.files[0]) {
    let reader = new FileReader();
    reader.onload = function(e) {
      setTimeout(()=>$(input).parent().find("img.img-preview").attr("src", e.target.result).fadeIn(), 200);
    }
    reader.readAsDataURL(input.files[0]);
  } else {
    $(input).parent().find("img.img-preview").removeAttr("src").slideUp();
  }
}


// Start zoom picture
  // Get the modal
  var modal = document.getElementById('myModal');

  // Get the image and insert it inside the modal - use its "alt" text as a caption
  $('.img-timeline').click( function () {
    $('#photo-timeline').hide();
    $('#myModal').css('display', 'block');
    $('#img01').attr('src', $(this).attr('src'));
    $('#modal-title').text($(this).data('title'));
    $('#modal-date').text($(this).data('date'));
    $('#modal-caption').text($(this).data('caption'));
    $('#modal-author').text($(this).data('author'));
  });

  // Get the <span> element that closes the modal
  var modal = document.getElementById('myModal');

  // When the user clicks on <span> (x), close the modal
  modal.onclick = function() { 
    modal.style.display = "none";
    document.getElementById("photo-timeline").style.display = ""; 
  }
// End zoom picture
//drag and drop image 
// ************************ Drag and drop ***************** //
let dropArea = document.getElementById("drop-area")

// Prevent default drag behaviors
;['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
  dropArea.addEventListener(eventName, preventDefaults, false)   
  document.body.addEventListener(eventName, preventDefaults, false)
})

// Highlight drop area when item is dragged over it
;['dragenter', 'dragover'].forEach(eventName => {
  dropArea.addEventListener(eventName, highlight, false)
})

;['dragleave', 'drop'].forEach(eventName => {
  dropArea.addEventListener(eventName, unhighlight, false)
})

// Handle dropped files
dropArea.addEventListener('drop', handleDrop, false)

function preventDefaults (e) {
  e.preventDefault()
  e.stopPropagation()
}

function highlight(e) {
  dropArea.classList.add('highlight')
}

function unhighlight(e) {
  dropArea.classList.remove('active')
}

function handleDrop(e) {
  var dt = e.dataTransfer
  var files = dt.files

  handleFiles(files)
}

let uploadProgress = []
let progressBar = document.getElementById('progress-bar')

function initializeProgress(numFiles) {
  progressBar.value = 0
  uploadProgress = []

  for(let i = numFiles; i > 0; i--) {
    uploadProgress.push(0)
  }
}

function updateProgress(fileNumber, percent) {
  uploadProgress[fileNumber] = percent
  let total = uploadProgress.reduce((tot, curr) => tot + curr, 0) / uploadProgress.length
  console.debug('update', fileNumber, percent, total)
  progressBar.value = total
}

function handleFiles(files) {
  files = [...files];
  initializeProgress(files.length);
  // files.forEach(uploadFile);
  files.forEach(previewFile);
}

// preview image
function previewFile(file) {
  let reader = new FileReader()
  reader.readAsDataURL(file)
  reader.onloadend = function() {
    let img = document.createElement('img');
    img.setAttribute('name','upload_img');
    img.setAttribute('id','img_upload');
    img.src = reader.result
    document.getElementById('gallery').appendChild(img);
    document.getElementById("drop-image-here").style.display = "none";
    document.getElementById('img_upload').style.margin = '0px 50px';
    document.getElementById('up_photo_btn').classList.remove('hideButton');
    document.getElementById('crop_resize').classList.remove('hideButton');
    document.getElementById('select-image').classList.add('hideButton');

  }
}

// start document
$(document).ready(function(){
  var groupCode = $('#up_photo_form').data('code');
  //4.1 start upload photo story
  $('#up_photo_btn').click(function (e){
    $('#add-load').removeClass('hide');
    e.preventDefault();
    var form = document.querySelector('#up_photo_form');

    $.ajax({
      url: `/groups/${groupCode}/upload`,
      method: 'POST',
      dataType: 'json',
      data: new FormData(form),
      processData: false,
      contentType: false,

    }).done(function (data){
      $('#add-load').addClass('hide');
      form.reset();

      if (data.error) {
        console.log(data.error);
        alert('Add fail');
      }
      else {
        // addGroupPhoto(data.photo);
        alert("Add successfully");
      }
      window.location.reload();
    }).fail(function (data) {
      console.log(data.error); 
    });
  });
  // end upload photo story

})
// end document