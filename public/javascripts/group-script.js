$(document).ready(()=> {
	$('#all-groups-names').on('click', '.group-name', function() {
		let code = $(this).data('code');
		$('.chosen-name').addClass('hide');
		$(this).find('.chosen-name').removeClass('hide');
		$('.group-card').removeClass('show').hide();
		$('.group-card[data-code=' + code +']').show().addClass('show');
	});

	$('#btn-add-group').click( function() {
		$('.group-card').removeClass('show').hide();
		$('#add-group-card').show().addClass('show');
	});

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
			let renderName = `<h5 class="group-name" data-code="${data.group.code}">`;
			renderName += `<hr><i class="far fa-dot-circle hide chosen-name"> </i>`;
			renderName += `<span class="name"> ${data.group.name} </span>`;
			renderName += `<i class="fa fa-angle-right arrow-right float-right"></i></h5>`;
			$(renderName).prependTo('#all-groups-names').hide().slideDown();
			// clearForm
			clearForm($(this));
			// update group list
			$('#groupCount').text(1+Number($('#groupCount').text()));
			// show new group detail
			$(`.group-name[data-code="${data.group.code}"]`).click();
			// clear search action
			$('#search-group').val('');
			$('#search-group').trigger('keyup')
		}).fail( (jqXHR, statusText, errorThrown) => {
			alert('Some thing wrong !');
			console.log('Fail:' + jqXHR.responseText);
			console.log(statusText);
		});
	});

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

	$('#search-group').on('keyup', function() {
		let query = ' ' + $(this).val();
		$('span.name').each((i, val) => {
			let data = $(val).text();
			if (queryLetter(query, data)) 
				$(val).parents('.group-name').slideDown();
			else 
				$(val).parents('.group-name').slideUp();
		});
	});
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
	$(form).find('input:not(.hidden)').val();
}