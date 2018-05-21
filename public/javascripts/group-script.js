$(document).ready(()=> {
	let auns = [];
	$.ajax({
		url: '/auns',
		type: 'get'
	}).done(data => {
		if (data.error)
			return console.log(error);
		if (data.data)
			auns = data.data;
		$('.in_username').autocomplete({source: auns});
		console.log(data.data)
	});
	
	// select group and show group info
	$('#all-groups-names').on('click', '.group-name', function() {
		let code = $(this).data('code');
		$('.chosen-name').addClass('hide');
		$('.spename').removeClass('chosen');
		$(this).find('.chosen-name').parent().find('.spename').addClass('chosen');
		$(this).find('.chosen-name').removeClass('hide');
		$('.group-card').removeClass('show').hide();
		$('.group-card[data-code=' + code +']').show().addClass('show');
	});

	// show add group board
	$('#btn-add-group').click( function() {
		$('.group-card').removeClass('show').hide();
		$('#add-group-card').show().addClass('show');
		$('.chosen-name').addClass('hide');
		$('.spename').removeClass('chosen');
	});

	// when submit adding new group
	$('#add-group-form').submit(function(e) {
		e.preventDefault();
		$('#add-load').removeClass('hide');
		$.ajax({
			url: '/groups/create',
			method: 'post',
			data: {
				groupName: $(this).find('[name=groupName]').val(),
				groupCode: $(this).find('[name=groupCode]').val()
			}
		}).done( (data, status, jqXHTT) => {
			$('#add-load').addClass('hide');
			if (data.error) return alert(data.error);
			if (data.renErr) {
				alert("Render error: See more on console log");
				return console.log(data.renErr);
			}
			$('#all-cards').append(data.render);
			// append group name
			let renderName = `<hr>`;
			renderName += `<h5 class="group-name" data-code="${data.group.code}">`;
			renderName += 	`<span class="name">`;
			renderName += 		`<i class="far fa-dot-circle hide chosen-name"> </i>`;
			renderName += 		`<span class="spename"> ${data.group.name} </span>`;
			renderName += 	`</span>`;
			renderName += 	`<i class="fa fa-angle-right arrow-right float-right"></i>`;
			renderName += `</h5>`;
			$(renderName).prependTo('#all-groups-names').hide().slideDown();
			// clearForm
			clearForm($(this));
			// update group list
			$('#groupCount').text(1+Number($('#groupCount').text()));
			// show new group detail
			$(`.group-name[data-code="${data.group.code}"]`).click();
			// clear search action
			$('#search-group').val('');
			$('#search-group').trigger('keyup');
			$('.in_username').autocomplete({source: auns});
		}).fail( (jqXHR, statusText, errorThrown) => {
			alert('Some thing wrong !');
			console.log('Fail:' + jqXHR.responseText);
			console.log(statusText);
		});
	});


	// add new member
	$('#all-cards').on('submit', '.add-member-form', function(e) {
		e.preventDefault();
		$('#add-load').removeClass('hide');
		let username = $(this).find('[name=username]').val();
		let groupCode = $(this).find('[name=groupCode]').val();
		$.ajax({
			url: '/groups/addMember',
			method: 'post',
			data: {username, groupCode}
		}).done( (data, status, jqXHTT) => {
			$('#add-load').addClass('hide');
			$(`#collapse-member-${groupCode}`).collapse('show');
			if (data.error) return alert(data.error);
			if (!data.group) return alert("Some thing wrong !");
			$('<h5>' + username + '</h5>')
			.prependTo('#collapse-member-'+ groupCode)
			.hide().slideDown();
			// clearForm
			clearForm($(this));
			// update group list
			$('#memberCount' + groupCode).text(1+Number($('#memberCount' + groupCode).text()));
		}).fail( (jqXHR, statusText, errorThrown) => {
			alert('Some thing wrong !');
			console.log('Fail:' + jqXHR.responseText);
			console.log(statusText);
		});
	});

	// search groups on key up
	$('#search-group').on('keyup', function() {
		let query = ' ' + $(this).val();
		$('span.name').each((i, val) => {
			let data = $(val).text();
			if (queryLetter(query.toLowerCase(), data.toLowerCase())) 
				$(val).parents('.each-group').slideDown();
			else 
				$(val).parents('.each-group').slideUp();
		});
	});

	// prevent special characters
	$('#add-group-card input#groupCode').attr('pattern', '[a-zA-Z0-9]{3,15}');
	$('#add-group-card input#groupName').attr('pattern', '^.{3,25}$');
	$('#add-group-card input').attr('title', 'Cannot contain special characters and must be from 3 to 15 characters');
});

function queryLetter(query, data) {
	let count = 0;
	let length = query.length;
	for (let a = 0; a < data.length; a++) 
		for (let b = 0; b < query.length; b++)
			if (data[a] === query[b]) {
				count++;
				data = data.replace(data[a], "");
				query = query.replace(query[b], "");
				a--;
				b = 0;
			}
	return count >= parseInt(length)*1.3/2;
}

function clearForm(form) {
	$(form).find('input:not(.hidden)').val('');
}

