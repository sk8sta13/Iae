$(document).ready(function(){

	$('#newFriend').click(function(e) {
		e.preventDefault();
		bootbox.dialog({
			title: 'Search your friend',
			message: '<div class="row"><div class="col-md-12"><input class="form-control" id="search" type="text" placeholder="E-mail address your friend"></div><div id="tblArea" class="panel-body"></div></div>',
			buttons: {
				search: {
					label: 'Search',
					className: 'btn-default',
					callback: function() {
						var table = '<table class="table table-striped"><thead><tr><th></th><th>Friend</th></tr></thead><tbody>#data</tbody></table>';

						$.ajax({
							method: 'POST',
							url: '/search',
							data: { email: $('#search').val() },
							success: function(data) {
								if (data.status == 'success') {
									var friends = '';
									$.each(data.users, function(index, friend) {
  										friends += '<tr><td><input type="checkbox" id="emailFriend" value="' + friend.email + '"></td><td>' + friend.name + '&nbsp;&lt;' + friend.email + '&gt;</td></tr>';
									});
									table = table.replace('#data', friends);
								} else {
									table = '<tr><td colspan="2">No registration Found</td></tr>';
								}
								$('#tblArea').append(table);
							}
						});

						return false;
					}
				},
				success: {
					label: 'Add',
					className: 'btn-success',
					callback: function () {
						if ($('#emailFriend').is(':checked')) {
							$.ajax({
								method: 'POST',
								url: '/add-friend',
								data: { email: $('#emailFriend').val() }
							});
						} else {
							console.log('teste');
						}
					}
				}
			}
		});
	});

	$('#delete').click(function(e) {
		e.preventDefault();
		var href = $(this).attr('href');
		bootbox.confirm('Really want to delete your account?', function(result) {
			if (result) {
				document.location = href;
			}
		}); 
	});

	$('#forgot').click(function(e) {
		e.preventDefault();
		$('form').attr('action', '/forgot');
		$('form #password').removeAttr('required').removeAttr('minlength');
		$('form').submit();
	});

	$('button [type=submit]').click(function() {
		$('form').removeAttr('action');
		$('form #password').Attr({
			required: required,
			minlength: 6
		});
		$('form').submit();
	});

	$('#frmUpdatePassword').validate({
		errorLabelContainer: $('#frmUpdatePassword span.error')
	});

	$('#frmProfile').validate({
		errorLabelContainer: $('#frmProfile span.error')
	});

	$('#frmLogin').validate({
		errorLabelContainer: $('#frmLogin span.error')
	});

	$('#frmSignup').validate({
		errorLabelContainer: $('#frmSignup span.error')
	});

	$(".submenu > a").click(function(e) {
		e.preventDefault();
		var $li = $(this).parent("li");
		var $ul = $(this).next("ul");

		if($li.hasClass("open")) {
			$ul.slideUp(350);
			$li.removeClass("open");
		} else {
			$(".nav > li > ul").slideUp(350);
			$(".nav > li").removeClass("open");
			$ul.slideDown(350);
			$li.addClass("open");
		}
	});

});