//paste this code under head tag or in a seperate js file.
// Wait for window load

var client = new BinaryClient('ws://localhost:9000/binary-endpoint');

$(window).load(function() {
	// Animate loader off screen
	$(".se-pre-con").fadeOut("slow");
});

$(document).ready(function(){

	// Admin Login
	$('#admin-login').on('click', function(e){
		var email = $('.email').val();
		var password = $('.password').val();
		$.ajax({
			url:'/admin/login',
			type:'post',
			dataType: 'json',
			data:{email:email, password: password},
			success: function(data){
				console.log(data);
				if(data.error)
					$('#error-login').text('Invalid Username or Password').removeClass('hidden');
				else
					window.location.href = data.url;
			},
			error: function(jqXhr, textStatus, errorThrown){
				//alert(errorThrown);
				$('#error-login').text('Invalid Username or Password').removeClass('hidden');
			}
		});

		e.preventDefault();
	});

	//Submit feedback
	$('.btnFeedbackSubmit').click(function(e){
		e.preventDefault();
		var q1 = $("input[name='q1_theObjectives']:checked").val(),
		q2 = $("input[name='q2_theObjectives']:checked").val(),
		q3 = $("input[name='q3theTopics']:checked").val(),
		q4 = $("input[name='q4_theCourse']:checked").val(),
		q5 = $("input[name='q5_theFacilitator']:checked").val(),
		q6 = $("input[name='q6_theFacilitator']:checked").val(),
		q7 = $("input[name='q7_theFacilitator']:checked").val(),
		q8 = $("input[name='q8_theFacilitator']:checked").val(),
		comment = $(".comment").val(),
		id = $("#course_id").text();
		$.ajax({
			url:'/course/writefeedback/',
			type:'post',
			dataType: 'json',
			data:{id: id,q1: q1, q2: q2, q3: q3, q4: q4, q5: q5, q6: q6, q7: q7, q8: q8, comment: comment},
			success: function(data){		
				$('#error-feedback').text("Feedback Submitted Successfully").removeClass('hidden').addClass('alert-success');
				$('#wrap').hide();
			},
			error: function(jqXhr, textStatus, errorThrown){
				alert("Couldn't submit");
			}
		});
	});

	//Delete file
	$('.btn-delete').click(function(e){
		e.preventDefault();
		
		var id = $(this).attr('id');
		$.ajax({
			url:'/course/delete',
			type:'get',
			dataType: 'json',
			data:{id: id},
			success: function(data){
				console.log(data);
				$('#' + id).closest('.list-group-item').remove();
			},
			error:function(jqXhr, textStatus, errorThrown){
				alert("Error deleting");
			}
		});
	});

	//Upload content for manage
	$('.upload-bar').click(function(e){
		e.preventDefault();
		$('#upload-course-content').click();
	});
	$('#upload-course-content').change(function(e){
		var course_content = e.target.files[0];
		var tx = 0;

		var stream = client.send(course_content, {event:'create_course', name: course_content.name, size: course_content.size});
		stream.on('data', function(data){
			if(data.end){				
				$.ajax({
					url:'/trainer/upload/',
					type:'post',
					dataType: 'json',
					data:{filname : course_content.name, _id: $('.upload-bar').attr('id')},
					success: function(data){	
						$('.upload-bar').removeAttr('data-loading-text');
						$('.upload-bar').removeAttr('disabled');
						$('.upload-bar').text("");
						$('.upload-bar').append("<i class='fa fa-upload'> Upload a new courseware </i>");
						$('.courseware-list')
						.append("<li class='list-group-item'>\
							<label>" + data.name +
							"</label><div class='content-download'>\
							<label>\
							<a href='/course/download/" + data.name + "'>" + 
							"<i class='fa fa-download fa-2x'></i></a></label> \
							<label>\
							<a href='#' id='" + data.id + "' class='btn-delete'><i class='cross fa fa-times fa-2x'></i></a></label></li>");

					},
					error: function(jqXhr, textStatus, errorThrown){
						
					}
				});

				$('.upload-bar').removeAttr('data-loading-text');
				$('.upload-bar').removeAttr('disabled');
				$('.upload-bar').text("");
				$('.upload-bar').append("<i class='fa fa-upload'></i> Upload a new courseware")
			} else {
				var per = Math.round(tx+=data.rx*100);
				$('.upload-bar').attr('disabled', 'disabled');
				$('.upload-bar').attr('data-loading-text', per + '% complete');
				$('.upload-bar').text(per + '% complete');
			}
		});
});

	//Trainer Request Approve
	$('.Approve').click(function(e){
		e.preventDefault();

		var id = $('.Approve').parent().parent().attr('id');
		
		$.ajax({
			url:'/admin/trainer-approval',
			type:'post',
			dataType: 'json',
			data:{id : id},
			success: function(data){		
				$('#' + id).toggle( "slide" );
				$('#' + id).remove();
			},
			error: function(jqXhr, textStatus, errorThrown){
				alert("Couldn't submit");
			}
		});
	});

	$('.Reject').click(function(e){
		e.preventDefault();

		var id = $('.Reject').parent().parent().attr('id');
		
		$.ajax({
			url:'/admin/trainer-reject',
			type:'post',
			dataType: 'json',
			data:{id : id},
			success: function(data){		
				$('#' + id).toggle( "slide" );
				$('#' + id).remove();
				
			},
			error: function(jqXhr, textStatus, errorThrown){
				alert("Couldn't submit");
			}
		});
	});

	//Enroll button click
	$('.enroll-btn').click(function(e){
		e.preventDefault();
		var course_id = $(this).attr('id');
		$.post('/course/viewcourse/' + course_id, function( data ) {
			if(data.success == true){
				$('.enroll-btn').text('Registered');
				$('.enroll-btn').addClass('btn-success');
				$('.enroll-btn').removeClass('enroll-btn');
			} else {
				window.location.href = "/?redirect=" + window.location.pathname;
			}
		});
	});

	//Exam Timmer Clock
	/*
	$('#timer').TimeCircles(
		{ time: { Days: { show: false }, Hours: { show: false }}, count_past_zero:false	
	});*/

	//Setting Exam
	$('#btn-SetExam').click(function(e){
		e.preventDefault();
		var question = $("#setQuestion").find('#question').val(),
		option1 = $("#setQuestion").find('#option1').val(),
		option2 = $("#setQuestion").find('#option2').val(),
		option3 = $("#setQuestion").find('#option3').val(),
		option4 = $("#setQuestion").find('#option4').val(),
		level = $("#setQuestion").find("#level option:selected").val(),
		answer = $("#setQuestion").find('#answer').val();
		$.ajax({
			url:'/course/questions',
			type:'post',
			dataType: 'json',
			data:{question: question, option1:option1, option2:option2, option3: option3, option4:option4, level:level, answer:answer},
			success: function(data){
				$('#setQuestion').trigger("reset");
			},
			error: function(jqXhr, textStatus, errorThrown){
				alert(errorThrown);
			}
		});
	});

	//Trainer Request
	$('#sendRequest').click(function(e){
		e.preventDefault();
		$.ajax({
			url:'/learner/request',
			type:'post',
			success: function(data){				
				alert('Request Sent successfully');
				$('#trainer-approval-personal-li').remove();
				$('#trainerApproval').modal('hide');
			},
			error: function(jqXhr, textStatus, errorThrown){
				alert("Couldn't submit");
			}
		});
	});

	//Submit answer
	$('#submitAnswer').click(function(e){
		e.preventDefault();

		var optnSelected = $("input[name=question]:checked").val(),
		qid = $('#submitAnswer').parent().attr('id');
		console.log(optnSelected);
		$.ajax({
			url:'/course/verifyAnswer',
			type:'post',
			dataType: 'json',
			data:{option : optnSelected, qid: qid},
			success: function(data){				
				if(data.score){
					$('.score p').text("You scored : " + data.score);
					$('#Exam').hide();
				} else
				{
					$(".question").text(data.quest.Question);
					$(".option1").text(data.quest.Option1);
					$(".option2").text(data.quest.Option2);
					$(".option3").text(data.quest.Option3);
					$(".option4").text(data.quest.Option4);
					$('#submitAnswer').parent().attr('id', data.quest._id);
				}
			},
			error: function(jqXhr, textStatus, errorThrown){
				alert(errorThrown);
			}
		});
	});

	
	var course_img, course_vid;

	/*$('#course_image').click(function(){
		$('#upload-course-pic').click();
	});*/
	
	$('#upload-course-pic').change(function(e){
		course_img = e.target.files[0];
		var img = URL.createObjectURL(e.target.files[0]);
		$('#course-picture-upload').attr('src', img);
		$('#course-picture-upload').css('opacity','1');

	});

	$('#course_introv').change(function(e){
		course_vid = e.target.files[0];
	});

	//Course creation Progressbar

	var courseCreationValidate = $('#msform').validate({
		rules : {
			uploadcoursepic : {
				required: true,
			},
		},
		messages:{
			uploadcoursepic : "Upload Picture",
		},
		errorElement: "span",
		errorClass: "help-inline",
	});

	$('.next1').click(function(e){
		e.preventDefault();
		if(courseCreationValidate.form())
			$('.next').click();

	});

	$('.next2').click(function(e){
		e.preventDefault();
		if(courseCreationValidate.form())
			// $('.next').click();
		$(this).next().click();
	});

	$('.next3').click(function(e){
		e.preventDefault();
		if(courseCreationValidate.form())
			// $('.next').click();
		$(this).next().click();

	});


	var current_fs, next_fs, previous_fs; //fieldsets
	var left, opacity, scale; //fieldset properties which we will animate
	var animating; //flag to prevent quick multi-click glitches
	$(".next").click(function(){
		
		if(animating) return false;
		animating = true;
		
		current_fs = $(this).parent();
		next_fs = $(this).parent().next();
		
		//activate next step on progressbar using the index of next_fs
		$("#progressbar li").eq($("fieldset").index(next_fs)).addClass("active");
		
		//show the next fieldset
		next_fs.show(); 
		//hide the current fieldset with style
		current_fs.animate({opacity: 0}, {
			step: function(now, mx) {
				//as the opacity of current_fs reduces to 0 - stored in "now"
				//1. scale current_fs down to 80%
				scale = 1 - (1 - now) * 0.2;
				//2. bring next_fs from the right(50%)
				left = (now * 50)+"%";
				//3. increase opacity of next_fs to 1 as it moves in
				opacity = 1 - now;
				current_fs.css({'transform': 'scale('+scale+')'});
				next_fs.css({'left': left, 'opacity': opacity});
			}, 
			duration: 800, 
			complete: function(){
				current_fs.hide();
				animating = false;
			}, 
			//this comes from the custom easing plugin
			easing: 'easeInOutBack'
		});

	});

$(".previous").click(function(){
	if(animating) return false;
	animating = true;

	current_fs = $(this).parent();
	previous_fs = $(this).parent().prev();

		//de-activate current step on progressbar
		$("#progressbar li").eq($("fieldset").index(current_fs)).removeClass("active");
		
		//show the previous fieldset
		previous_fs.show(); 
		//hide the current fieldset with style
		current_fs.animate({opacity: 0}, {
			step: function(now, mx) {
				//as the opacity of current_fs reduces to 0 - stored in "now"
				//1. scale previous_fs from 80% to 100%
				scale = 0.8 + (1 - now) * 0.2;
				//2. take current_fs to the right(50%) - from 0%
				left = ((1-now) * 50)+"%";
				//3. increase opacity of previous_fs to 1 as it moves in
				opacity = 1 - now;
				current_fs.css({'left': left});
				previous_fs.css({'transform': 'scale('+scale+')', 'opacity': opacity});
			}, 
			duration: 800, 
			complete: function(){
				current_fs.hide();
				animating = false;
			}, 
			//this comes from the custom easing plugin
			easing: 'easeInOutBack'
		});
	});


var today = new Date().toISOString().split('T')[0];

$("input[name='start_course_date']").attr('min', today);
$("input[name='end_course_date']").attr('min', today);
$('.date').attr('max', today);


$("#msform").submit(function(e){	

	e.preventDefault();
	var path = "/content/";
	//Binary js image upload
	$('#createcourse').next().remove();
	$('#createcourse').addClass('btn-disabled');
	$('#createcourse').text('Creating Course....');
	var title= $("#msform").find("input[name='course_title']").val(),
	category = $("#msform").find("#course_category option:selected").val(),
	intro = $("#msform").find("textarea#course_introduction").val(),
	prerequisites = $("#msform").find("textarea#course_prerequisites").val(),
	agenda = $("#msform").find("textarea#course_agenda").val(),
	certificate = $("#msform").find("input[name='certificate']:checked").val(),
	start = $("#msform").find("input[name='start_course_date']").val(),
	end = $("#msform").find("input[name='end_course_date']").val(),
	level = $("#msform").find("#course_level option:selected").val(),
	roomname= $("#msform").find("input[name='roomname']").val(),
	start_session = $("#msform").find("input[name='start_session_time']").val(),
	end_session = $("#msform").find("input[name='end_session_time']").val(),
	percentage = $("#msform").find("input[name='percentage']").val(),
	price = $("#msform").find("input[name='coursecharge']:checked").val(),
	description= $("#msform").find("textarea#course_description").val();
	
	var stream_img = client.send(course_img, {event:'create_course', name: course_img.name});
	var	stream_vid = client.send(course_vid, {event:'create_course', name: course_vid.name});

	stream_vid.on('data', function(data){
		if(data.end){
			$.ajax({
				url:'/trainer/create',
				type:'post',
				dataType: 'json',
				data:{title:title, category: category,intro: intro, prerequisites:prerequisites,agenda:agenda,certificate:certificate,start:start,end:end,level:level,roomname:roomname,start_session:start_session,end_session:end_session,percentage:percentage,price:price, description:description, video_path: path + course_vid.name, image_path: path + course_img.name},
				success: function(data){
					$('#error-course-creation').text('Course Created successfully').removeClass('alert-danger hidden').addClass('alert-success');
					$('#createcourse').hide();
					$('.previous').hide();
				},
				error: function(jqXhr, textStatus, errorThrown){
					$('#error-course-creation').text('Error Creation Course').removeClass('alert-success hidden').addClass('alert-danger');
				}
			});
		}
	});
	
	
});

	//Login Jquery
	function getParameterByName(name) {
		name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
		var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
		results = regex.exec(location.search);
		return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
	}

	$('#login').on('click', function(e){
		var email = $('.email').val();
		var password = $('.password').val();
		var loginValidate = $('#login-form').validate({
			errorElement: "span",
			errorClass: "help-inline",
		});
		if(loginValidate.form() ==  false)
			return false;
		$.ajax({
			url:'/login',
			type:'post',
			dataType: 'json',
			data:{email:email, password: password, redirect:getParameterByName('redirect')},
			success: function(data){
				window.location = data.url;
			},
			error: function(jqXhr, textStatus, errorThrown){
				//alert(errorThrown);
				$('#error-login').text('Invalid Username or Password').removeClass('hidden');
			}
		});

		e.preventDefault();

	});

	//Signup

	/*function checkPasswordMatch() {
		var checkpassword = $(".password").val();
		var confirmPassword = $(".repeatpassword").val();

		if (checkpassword != confirmPassword){
			//$('.password').css('border-color', '#a94442');
			//$('.repeatpassword').css('border-color', '#a94442');
			console.log($('.password').parent());
			$('.password').parent().removeClass('has-success').addClass('has-error');
			$('.repeatpassword').parent().removeClass('has-success').addClass('has-error');
		}
		else{
			$('.password').parent().removeClass('has-error').addClass('has-success');
			$('.repeatpassword').parent().removeClass('has-error').addClass('has-success');
		}
	}

	$(".repeatpassword").keyup(checkPasswordMatch);*/

	var signupValidate = $('#signup').validate({

		rules: {

			password:{
				minlength:8,
			},
			repeatpassword:{
				equalTo: '#password',
			}

		},
		errorElement: "span",
		errorClass: "help-inline",

	});

	$('#signup').submit(function(e){

		if(signupValidate.form()){
			var email = $('.email').val();
			var password = $('.password').val();
			var repeatpassword = $('.repeatpassword').val();
			var name = $('.name').val();
			var occupation = $('.occupation').val();
			var country = $('.country').val();
			var date = $('.date').val();

			if(password === repeatpassword){
				
				$.ajax({
					url:'/signup',
					type:'post',
					dataType:'json',
					data:{email:email, password:password, name:name, occupation:occupation, country:country, date:date},
					success:function(data){
						$('#error-register').text('Registered successfully.').removeClass('alert-danger hidden').addClass('alert-success');
						$('#signup').hide();
					},
					error:function(jqXhr, textStatus, errorThrown){
						$('#error-register').text('Error in Registration.').removeClass('alert-success hidden').addClass('alert-danger');
					}		
				});
			} else {
				$('.password').css('border-color', 'red');
				$('.repeatpassword').css('border-color', 'red');
			}
		}
		
		e.preventDefault();
	});


	$('#logout').on('click',function(e){
		if(document.cookie){
			$.ajax({
				type: 'GET',
				cache: false,
				dataType: 'json',
				url: '/logout',
				headers: {
					token: null
				},
				success: function(data){
					window.location = '/';
				},
				error: function(jqXhr, textStatus, errorThrown){
					alert(errorThrown);
				}
			});
		} else {
			window.location='/';
		}
		e.preventDefault();
	});

	//Jquery slide menu admin
	$('#notification').click(function(e){
		e.preventDefault();
		var current = $('#object-nav li.active a').attr('href');
		$('#object-nav li').removeClass('active');
		$(current).hide();
		var active = $("#profile-personal-li").addClass('active').find('a').attr('href')
		$(active).slideToggle('slow');

		$.ajax({
			url:'/admin/read',
			success: function(data){   
				if(data.success){
					$('.notification-count').hide();
				}
			},
			error: function(jqXhr, textStatus, errorThrown){

			}
		});
	});

	$('#notification-admin').hide();
	$('#object-nav li').click(function(e){		
		var current = $('#object-nav li.active a').attr('href');
		$('#object-nav li').removeClass('active');
		$(current).hide();
		
		var active = $(this).addClass('active').find('a').attr('href')
		$(active).show();
		
	});

	// Jquery slide menu learner
	$('#courses-learner, #profile-learner, #notification-learner').hide();
	$('#object-nav li').click(function(e){		
		var current = $('#object-nav li.active a').attr('href');
		$('#object-nav li').removeClass('active');
		$(current).hide();
		var active = $(this).addClass('active').find('a').attr('href')
		$(active).slideToggle('slow');
	});
	// Jquery slide menu trainer
	$('#courses-trainer, #profile-trainer, #notification-trainer').hide();
	$('#object-nav li').click(function(e){		
		var current = $('#object-nav li.active a').attr('href');
		$('#object-nav li').removeClass('active');
		$(current).hide();
		var active = $(this).addClass('active').find('a').attr('href')
		$(active).slideToggle('slow');
	});

	//jquery for dashboard line chart trainer
	// Get context with jQuery - using jQuery's .get() method.
	
	/*window.onresize = function(event){
		var width = $('canvas').parent().width();
		$('canvas').attr("width",width);
		new Chart(ctx).Line(data);
	};*/

	
});
