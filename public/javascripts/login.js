$('.toggle').on('click', function() {
  $('.container').stop().addClass('active');
});

$('.close').on('click', function() {
  $('.container').stop().removeClass('active');
});

// sign up password checking
$('#su_password, #su_repassword').on('keyup', function(){
  var password = $('#su_password').val();
  var repassword = $('#su_repassword').val();

  if (password === repassword) {
    $('#message').html('MATCHES').css("color", "green");
    $('#message').parent('div').removeAttr('hidden');
  }
  else {
    $('#message').html('NOT MATCHES').css("color", "red");
    $('#message').parent('div').removeAttr('hidden');
  }
});

$('form').submit( () => {
  $('#add-load').removeClass('hide');
});

// sign up submit
let valid = false;
$('#su_form').submit(function(e){
  if (!valid) {
   e.preventDefault();
   var username = $('#su_username').val();
   var password = $('#su_password').val();
   var repassword = $('#su_repassword').val();
   if (password !== repassword) { 
      e.preventDefault();
      alert('Passwords do not match');
      $('#add-load').addClass('hide');
      valid = false;
      return;
    }
    $.ajax({
      url: '/checkUser',
      type: 'post',
      data: {username, password}
    }).done(data => {
      $('#add-load').addClass('hide');
      if (data.error) {
        alert(data.error);
        valid = false;
      } else {
        valid = true;
        $('#su_form').submit();
      }

    }).fail( (jqXHR, statusText, errorThrown) => {
      alert('Some thing wrong !');
      console.log('Fail:' + jqXHR.responseText);
      console.log(statusText);
    });
  }
});
// prevent special characters
$('input').attr('pattern', '[a-zA-Z0-9]{6,}');
$('input').attr('title', 'Cannot contain special characters and must be at least 6 characters');

// start document
// end document
$('input').attr('title', 'Cannot contain special characters and must be at least 6 characters');
