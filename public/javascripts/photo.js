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
})();


// Start zoom picture
  // Get the modal
  var modal = document.getElementById('myModal');

  // Get the image and insert it inside the modal - use its "alt" text as a caption
  var img = document.getElementById('myImg');
  var modalImg = document.getElementById("img01");
  img.onclick = function(){
      document.getElementById("photo-timeline").style.display = 'none';
      modal.style.display = "block";
      modalImg.src = this.src;
  }

  // Get the <span> element that closes the modal
  var span = document.getElementsByClassName("close")[0];

  // When the user clicks on <span> (x), close the modal
  span.onclick = function() { 
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
  files = [...files]
  initializeProgress(files.length)
  files.forEach(uploadFile)
  files.forEach(previewFile)
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

// upload image
function uploadFile(file, i) {
  var url = 'https://api.cloudinary.com/v1_1/joezim007/image/upload'
  var xhr = new XMLHttpRequest()
  var formData = new FormData()
  xhr.open('POST', url, true)
  xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest')

  // Update progress (can be used to show progress indicator)
  xhr.upload.addEventListener("progress", function(e) {
    updateProgress(i, (e.loaded * 100.0 / e.total) || 100)
  })

  xhr.addEventListener('readystatechange', function(e) {
    if (xhr.readyState == 4 && xhr.status == 200) {
      updateProgress(i, 100) // <- Add this
    }
    else if (xhr.readyState == 4 && xhr.status != 200) {
      // Error. Inform the user
    }
  })

  formData.append('upload_preset', 'ujpu6gyk')
  formData.append('file', file)
  xhr.send(formData)
}
// end drag and drop image

// start add group photo
function addGroupPhoto(photo){
  var row = '';

  row+='<li class="fs-timeline-item">';
  row+='  <div class="fs-timeline-item-line"></div>';
  row+='  <div class="fs-timeline-item-bullet"></div>';
  // date
  row+='  <p class="fs-timeline-item-date">'+photo.date+'<br></p>';
  // title
  row+='  <p class="fs-timeline-item-description"><span class="fs-timeline-tag">'+photo.title+'</span>';
  // author
  row+='    <br>'+photo.author+' have a party with <a href="#">Mary Malinda Hall</a> and <a href="#">John Zera Alger</a>.<br>';
  // image
  row+='    <img id="myImg" src="'+photo.source+'" style="height: 150px">';
  row+='  </p>';
  row+='</li>';

  $('#photo-timeline').prepend(row);
};
// end add new group photo

// start document
$(document).ready(function(){

  //4.1 start upload photo story
  $('#up_photo_btn').click(function (e){
    e.preventDefault();
    var form = document.querySelector('#up_photo_form');

    $.ajax({
      url: '/groups/<group_code>/upload',
      method: 'POST',
      dataType: 'json',
      data: new FormData(form),
      processData: false,
      contentType: false,

    }).done(function (data){
      form.reset();

      if (data.error) {
        console.log(data.error);
        alert('Add fail');
      }
      else {
        addGroupPhoto(data.photo);
        alert("Add successfully");
      }

    }).fail(function (data) {
      console.log(data.error); 
    });
  });
  // end upload photo story

})
// end document