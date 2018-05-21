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

$('form').submit( (e) => {
	console.log('bablabla')
  $('#add-load').removeClass('hide');
});

// sign up submit
$('#su_form').submit(function(e){	
  var password = $('#su_password').val();
  var repassword = $('#su_repassword').val();

  if (password === repassword) 
  	return;
  // if matches then form will submit
  // else it will not
  e.preventDefault();
});

// prevent special characters
$('input').attr('pattern', '[a-zA-Z0-9]{6,}');
$('input').attr('title', 'Cannot contain special characters and must be at least 6 characters');