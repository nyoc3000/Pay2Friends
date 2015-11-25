
// api url
//var api_url = "http://192.168.100.108/escribe/api/";
//var app_url = "http://192.168.100.108/escribe/";
//var api_url = "http://instaonline.net/applications/escribe/api/";
//var app_url = "http://instaonline.net/applications/escribe/";

var api_url = "http://localhost/escribe/api/";
var app_url = "http://localhost/escribe/";
var data_obj = new Array();

/* --- */

function isValidEmailAddress(emailAddress) {
    var pattern = new RegExp(/^(("[\w-+\s]+")|([\w-+]+(?:\.[\w-+]+)*)|("[\w-+\s]+")([\w-+]+(?:\.[\w-+]+)*))(@((?:[\w-+]+\.)*\w[\w-+]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][\d]\.|1[\d]{2}\.|[\d]{1,2}\.))((25[0-5]|2[0-4][\d]|1[\d]{2}|[\d]{1,2})\.){2}(25[0-5]|2[0-4][\d]|1[\d]{2}|[\d]{1,2})\]?$)/i);
    return pattern.test(emailAddress);
};


// global forms validation function

function checkform(id){
	
	  var pass=1;
	  var recheck=0;
	  $(".val-val").remove();
	  $('#'+id).find('input, select').each(function(index, element) {
			
			$(element).css('border', '');		
			if ($(element).hasClass('val-required') && $(element).val()=='') { $(element).css('border', '1px solid red'); $('<p class="val-val">This field is required</p>').insertAfter(element); pass=0;	} 
			else if ($(element).hasClass('val-email') && !isValidEmailAddress($(element).val())) { $(element).css('border', '1px solid red'); $('<p class="val-val">Insert a valid e-mail</p>').insertAfter(element); pass=0;	} 
			else if ($(element).hasClass('val-min6') && $(element).val().length<6)  { $(element).css('border', '1px solid red'); $('<p class="val-val">Minimum 6 characters</p>').insertAfter(element); pass=0;	} 
			else if ($(element).hasClass('val-checked') && !$(element).prop('checked')) { alert('You must accept the Terms and Conditions to continue'); pass=0;	} 

		}); 
	   
	   if (pass==1) { 
			return true;
	   } else  {
		   return false;
	   }
   
		
}


function api_login() {
	
	var login = {'data':{'user': $('#username').val(), 'password':$('#password').val()}};
	$.ajax({
		type:  'post',
		url: api_url+"users/login",
		dataType: "json", 
		data:  {data:JSON.stringify(login)},
		success: function(result){
        	if (result['status_code']==200) {
				localStorage.setItem("id", result['result'][0]['users_id']);
				localStorage.setItem("token", result['token']);
				window.location = "logged.html"
			} else {
				ons.notification.alert({
					title: '',
					message: result['message']
				});
			}
    	}
	});
}

function api_reset() {
	$('.loaderover').show();
	
	var login = {'data':{'user': $('#usere').val()}};
	var email=$('#usere').val();
	$.ajax({
		type:  'post',
		url: api_url+"users/reset_pass",
		dataType: "json", 
		data:  {data:JSON.stringify(login)},
		success: function(result){
			$('.loaderover').hide();
        	if (result['status_code']==200) {
				ons.notification.alert({
					title: '',
					message: 'An email has been sent to '+email+' with your new password.'
				});
				myNavigator.popPage();	
			} else {
				ons.notification.alert({
					title: '',
					message: result['message']
				});
			}
    	}
	});
}

function logout() {
	
	var login = {'data':{'id': localStorage.getItem("id")}};
	$.ajax({
		type:  'post',
		url: api_url+"users/logout",
		dataType: "json", 
		data:  {data:JSON.stringify(login)},
		success: function(result){
        	if (result['status_code']==200) {
				localStorage.setItem("id", '');
				localStorage.setItem("token", '');
				window.location = "index.html"
			} else {
				ons.notification.alert({
					title: '',
					message: result['message']
				});
				if ( result['status_code']==401 ) {logout();}
			}
    	}
	});
}

function register_user() {
	
	var register = {'data':{'user': $('#email').val(), 'password':$('#password').val(), 'firstname':$('#firstname').val(), 'lastname':$('#lastname').val(), 'date':$('#birth').val(), 'city':$('#city').val(), 'address':$('#address').val(), 'province':$('#province').val(), 'zip':$('#zip').val(), 'mobile':$('#mobile').val(), 'sin':$('#sin').val()}};
	$.ajax({
		type:  'post',
		url: api_url+"users/register",
		dataType: "json", 
		data:  {data:JSON.stringify(register)},
		success: function(result){
        	if (result['status_code']==200) {
				ons.notification.alert({
					title: '',
					message: 'Register successful!'
				});
				myNavigator.pushPage('login', { animation: 'lift' });				
			} else {
				ons.notification.alert({
					title: '',
					message: result['message']
				});
				if ( result['status_code']==401 ) {logout();}
			}
    	}
	});
}

function edit_user() {
	
	var register = {'data':{'id': localStorage.getItem("id"), 'token':localStorage.getItem("token"), 'user': $('#email').val(), 'password':$('#password').val(), 'firstname':$('#firstname').val(), 'lastname':$('#lastname').val(), 'date':$('#birth').val(), 'city':$('#city').val(), 'address':$('#address').val(), 'province':$('#province').val(), 'zip':$('#zip').val(), 'mobile':$('#mobile').val(), 'sin':$('#sin').val(), 'edit':$('#edit').val()}};
	$.ajax({
		type:  'post',
		url: api_url+"users/mydata",
		dataType: "json", 
		data:  {data:JSON.stringify(register)},
		success: function(result){
        	if (result['status_code']==200) {
				ons.notification.alert({
					title: '',
					message: 'Data successfully saved'
				});

				myNavigator.popPage();				
			} else {
				ons.notification.alert({
					title: '',
					message: result['message']
				});
				if ( result['status_code']==401 ) {logout();}
			}
    	}
	});
}

function validate() {
	
	var login = {'data':{'id': localStorage.getItem("id"), 'token':localStorage.getItem("token")}};
	$.ajax({
		type:  'post',
		url: api_url+"users/login",
		dataType: "json", 
		data:  {data:JSON.stringify(login)},
		success: function(result){
        	if (result['status_code']==200) {
				loaduserdata();
			} else {
				window.location = "index.html"
			}
    	}
	});
}


function loaduserdata(){

	var credentials = {'data':{'id': localStorage.getItem("id"), 'token':localStorage.getItem("token")}};
	$.ajax({
		type:  'post',
		url: api_url+"users/getdata",
		dataType: "json", 
		data:  {data:JSON.stringify(credentials)},
		success: function(result){
        	if (result['status_code']==200) {
				data_obj=result['result'][0];
				fillup();
				
			} else {
				window.location = "index.html"
			}
    	}
	});
	
}


function fillup(){
	for (key in data_obj) {
	  if (key=='users_number') { $('#barcode').attr('src',app_url+'data/codebars/'+data_obj[key]+'.jpg'); }
	  $('#'+key).html(data_obj[key]);
	  
	}
	$('.35000d').hide();
}

function mydata(){
	
	if($('#mydata').length) {  } else {	myNavigator.pushPage('mydata', { animation: 'slide' }); }

	var credentials = {'data':{'id': localStorage.getItem("id"), 'token':localStorage.getItem("token")}};
	$.ajax({
		type:  'post',
		url: api_url+"users/mydata",
		dataType: "json", 
		data:  {data:JSON.stringify(credentials)},
		success: function(result){
        	if (result['status_code']==200) {
				$('#mydata').html(result['result']['html'])
				
			} else {
				window.location = "index.html"
			}
    	}
	});
	
}



/* doctors */

function loaddoctors(){
	if($('#doctorslist').length) {  } else {	myNavigator.pushPage('findyourdoctor', { animation: 'slide' }); }
	
	var credentials = {'data':{'id': localStorage.getItem("id"), 'token':localStorage.getItem("token")}};
	$.ajax({
		type:  'post',
		url: api_url+"doctors/get_doctors_list",
		dataType: "json", 
		data:  {data:JSON.stringify(credentials)},
		success: function(result){
        	if (result['status_code']==200) {
				if (result['result']!=0){
					$('#doctorslist').html(result['result']['html'])
				}
				
			} else {
				ons.notification.alert({
					title: '',
					message: result['message']
				});
				if ( result['status_code']==401 ) {logout();}
			}
    	}
	});
	
}

function saveddoctors(){
	
	if($('#saveddoctorslist').length) {  } else {	myNavigator.pushPage('saveddoctors', { animation: 'slide' }); }
	
	var credentials = {'data':{'id': localStorage.getItem("id"), 'token':localStorage.getItem("token"), 'my':1}};
	$.ajax({
		type:  'post',
		url: api_url+"doctors/get_doctors_list",
		dataType: "json", 
		data:  {data:JSON.stringify(credentials)},
		success: function(result){
        	if (result['status_code']==200) {
				if (result['result']!=0){
					$('#saveddoctorslist').html(result['result']['html'])
				}
				
			} else {
				ons.notification.alert({
					title: '',
					message: result['message']
				});
				if ( result['status_code']==401 ) {logout();}
			}
    	}
	});
	
}

function deletedoctors(id){
	
	if (id == 0 ) {
	var ids;
	$('.delete').remove();
	$('#editbut').hide();
	$('#overbutton_editdoctors').show(300);
	$('#saveddoctorslist li').each(function(index, element) {
		ids=$(element).attr('id');
        $(element).removeClass('active');
		$(element).attr('onclick', '');
		$(element).children('.doctordetail').hide();
		$(element).append('<a href="javascript:void(0);" class="fa-remove fa-2x removeitem" onclick="deletedoctors(this);"></a>');
    });
	} else if (id=='e') {
		$('#editbut').show();
		 saveddoctors();
		 $('#overbutton_editdoctors').hide(300);
		
	} else {
	  ons.notification.confirm({
      message: 'Are you sure you want to remove this doctor?',
      callback: function(idx) {
        switch(idx) {
          case 0:
            break;
          case 1:	  	
            dodeletedoctor(id);
			break;
		}
	} });
	
	}
	
}

function dodeletedoctor(obj) {
	
	var id=$(obj).parent().attr('id');

var credentials = {'data':{'id': localStorage.getItem("id"), 'token':localStorage.getItem("token"), 'doctor':id}};
	$.ajax({
		type:  'post',
		url: api_url+"doctors/delete_fav",
		dataType: "json", 
		data:  {data:JSON.stringify(credentials)},
		success: function(result){
        	if (result['status_code']==200) {
				$(obj).parent().remove();
				
			} else {
				ons.notification.alert({
					title: '',
					message: result['message']
				});
				if ( result['status_code']==401 ) {logout();}
			}
    	}
	});

}

function accordion(obj, parent){
	$('.additem').hide();
	if ( !$( obj ).hasClass( "active" ) ) {
		$(obj).children('.additem').show();
		$('.'+parent+' li').removeClass('active');
		$('.doctordetail').slideUp(200);
		$(obj).children('.doctordetail').slideDown(200);
		$(obj).addClass('active');	
		
		if ($('#map').is(":visible")) {
		locate_map();
		}
		
	} else {
		$('.additem').hide();
		$('.'+parent+' li').removeClass('active');
		$('.doctordetail').slideUp(200);
		$('#map').hide();
	}
	
}



function search_doctors() {
	
	$('#map').hide();
	var doc=$('#doctor').val();
	$('#doctorslist').html('<div class="35000dover"></div>');
	var credentials = {'data':{'id': localStorage.getItem("id"), 'token':localStorage.getItem("token"), 'doctor':doc}};
	$.ajax({
		type:  'post',
		url: api_url+"doctors/search",
		dataType: "json", 
		data:  {data:JSON.stringify(credentials)},
		success: function(result){
        	if (result['status_code']==200) {
				$('#doctorslist').html(result['result']['html'])
			} else {
				ons.notification.alert({
					title: '',
					message: result['message']
				});
				if ( result['status_code']==401 ) { logout(); }
				$('#doctorslist').html('');
			}
    	}
	});

	
}

function locate_map() {  // function valid for doctors and pharmacies

/*
	if ($('#map').is(":visible")) {
	    $('#map').hide();	
		return;
	}*/
	
	var long=$('.active').children('.long').html();
	var lat=$('.active').children('.lat').html();
	var title=$('.active').children('span').html();

	if (typeof(long)=='undefined') { 
		ons.notification.alert({
					title: '',
					message: 'Select an element to locate it in the map'
		});
	} else {
	
	$('#map').show();
	
	var mapCanvas = document.getElementById('map');
        var mapOptions = {
          center: new google.maps.LatLng(lat, long),
          zoom: 13,
		  disableDefaultUI: true,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        }
        var map = new google.maps.Map(mapCanvas, mapOptions);
		var marker = new google.maps.Marker({
			position: new google.maps.LatLng(lat, long),
			map: map,
			title: title
		});
		marker.setMap(map);
	}
	   

}

function addfavoritedoctor(doc){

	ons.notification.confirm({
      message: 'Do you want to save this doctor?',
      callback: function(idx) {
        switch(idx) {
          case 0:
		    return false;
            break;
          case 1:	  	

			var credentials = {'data':{'id': localStorage.getItem("id"), 'token':localStorage.getItem("token"), 'doctor':doc}};
			$.ajax({
				type:  'post',
				url: api_url+"doctors/add_fav",
				dataType: "json", 
				data:  {data:JSON.stringify(credentials)},
				success: function(result){
					if (result['status_code']==200) {
						search_doctors();
					} else {
						ons.notification.alert({
							title: '',
							message: result['message']
						});
						if ( result['status_code']==401 ) { logout(); }
					}
				}
			});
			
		}
		} });

}

/* pharmacies */

function loadpharmacies(){
	if($('#pharmacieslist').length) {  } else {	myNavigator.pushPage('pharmacies', { animation: 'slide' }); }
	
	var credentials = {'data':{'id': localStorage.getItem("id"), 'token':localStorage.getItem("token")}};
	$.ajax({
		type:  'post',
		url: api_url+"pharmacies/getdata",
		dataType: "json", 
		data:  {data:JSON.stringify(credentials)},
		success: function(result){
        	if (result['status_code']==200) {
				if (result['result']!=0){
					$('#doctorslist').html(result['result']['html'])
				}
				
			} else {
				ons.notification.alert({
					title: '',
					message: result['message']
				});
				if ( result['status_code']==401 ) {logout();}
			}
    	}
	});
	
}

function savedpharmacies(){
	
	if($('#saveddoctorslist').length) {  } else {	myNavigator.pushPage('savedpharmacies', { animation: 'slide' }); }
	
	var credentials = {'data':{'id': localStorage.getItem("id"), 'token':localStorage.getItem("token")}};
	$.ajax({
		type:  'post',
		url: api_url+"pharmacies/getdata",
		dataType: "json", 
		data:  {data:JSON.stringify(credentials)},
		success: function(result){
        	if (result['status_code']==200) {
				if (result['result']!=0){
					$('#saveddoctorslist').html(result['result']['html'])
				}
				
			} else {
				ons.notification.alert({
					title: '',
					message: result['message']
				});
				if ( result['status_code']==401 ) {logout();}
			}
    	}
	});
	
}

function deletepharmacies(id){
	
	if (id == 0 ) {
	var ids;
	$('.delete').remove();
	$('#editbut').hide();
	$('#overbutton_editph').show(300);
	$('#saveddoctorslist li').each(function(index, element) {
		ids=$(element).attr('id');
        $(element).removeClass('active');
		$(element).attr('onclick', '');
		$(element).children('.doctordetail').hide();
		//$(element).append('<div class="delete" style="color: red; float: right; font-size: 11px;  margin: 0 20px;" onclick="deletepharmacies(this);">X Delete</div>');
    	$(element).append('<a href="javascript:void(0);" class="fa-remove fa-2x removeitem" onclick="deletepharmacies(this);"></a>');
	});
	} else if (id=='e') {
		$('#editbut').show();
		 savedpharmacies();
		 $('#overbutton_editph').hide(300);
		
	} else {
	  ons.notification.confirm({
      message: 'Are you sure you want to remove this pharmacy?',
      callback: function(idx) {
        switch(idx) {
          case 0:
            break;
          case 1:	  	
            dodeletepharmacies(id);
			break;
		}
	} });
	
	}
	
}

function dodeletepharmacies(obj) {
	
	var id=$(obj).parent().attr('id');

var credentials = {'data':{'id': localStorage.getItem("id"), 'token':localStorage.getItem("token"), 'pharmacy':id}};
	$.ajax({
		type:  'post',
		url: api_url+"pharmacies/delete_fav",
		dataType: "json", 
		data:  {data:JSON.stringify(credentials)},
		success: function(result){
        	if (result['status_code']==200) {
				$(obj).parent().remove();
			} else {
				ons.notification.alert({
					title: '',
					message: result['message']
				});
				if ( result['status_code']==401 ) {logout();}
			}
    	}
	});

}


function search_pharmacy() {
	
	$('#map').hide();
	var doc=$('#pharmacy').val();
	$('#doctorslist').html('<div class="35000dover"></div>');
	var credentials = {'data':{'id': localStorage.getItem("id"), 'token':localStorage.getItem("token"), 'pharmacy':doc}};
	$.ajax({
		type:  'post',
		url: api_url+"pharmacies/search",
		dataType: "json", 
		data:  {data:JSON.stringify(credentials)},
		success: function(result){
        	if (result['status_code']==200) {
				$('#doctorslist').html(result['result']['html'])
			} else {
				ons.notification.alert({
					title: '',
					message: result['message']
				});
				if ( result['status_code']==401 ) {logout();}
				$('#doctorslist').html('');
			}
    	}
	});

	
}


function addfavoritepharmacy(doc){

	ons.notification.confirm({
      message: 'Do you want to save this pharmacy?',
      callback: function(idx) {
        switch(idx) {
          case 0:
		    return false;
            break;
          case 1:	  	
			var credentials = {'data':{'id': localStorage.getItem("id"), 'token':localStorage.getItem("token"), 'pharmacy':doc}};
			$.ajax({
				type:  'post',
				url: api_url+"pharmacies/add_fav",
				dataType: "json", 
				data:  {data:JSON.stringify(credentials)},
				success: function(result){
					if (result['status_code']==200) {
						search_pharmacy();
					} else {
						ons.notification.alert({
							title: '',
							message: result['message']
						});
						if ( result['status_code']==401 ) { logout(); }
					}
				}
			});
			
		}
		} });

}


/* medications */

function loadmedications(){
	if($('#doctorslist').length) {  } else {	myNavigator.pushPage('medications', { animation: 'slide' }); }
	
	var credentials = {'data':{'id': localStorage.getItem("id"), 'token':localStorage.getItem("token")}};
	$.ajax({
		type:  'post',
		url: api_url+"medications/getdata",
		dataType: "json", 
		data:  {data:JSON.stringify(credentials)},
		success: function(result){
        	if (result['status_code']==200) {
				if (result['result']!=0){
					$('#doctorslist').html(result['result']['html'])
				}
				
			} else {
				ons.notification.alert({
					title: '',
					message: result['message']
				});
				if ( result['status_code']==401 ) {logout();}
			}
    	}
	});
	
}



/* -- alergies --- */


function loadallergies(){
	if($('#doctorslist').length) {  } else {	myNavigator.pushPage('allergies', { animation: 'slide' }); }
	
	var credentials = {'data':{'id': localStorage.getItem("id"), 'token':localStorage.getItem("token")}};
	$.ajax({
		type:  'post',
		url: api_url+"allergies/getdata",
		dataType: "json", 
		data:  {data:JSON.stringify(credentials)},
		success: function(result){
        	if (result['status_code']==200) {
				if (result['result']!=0){
					$('#doctorslist').html(result['result']['html'])
				}
				
			} else {
				ons.notification.alert({
					title: '',
					message: result['message']
				});
				if ( result['status_code']==401 ) {logout();}
			}
    	}
	});
	
}


function add_allergy() {
	
	var add = {'data':{'id': localStorage.getItem("id"), 'token':localStorage.getItem("token"), 'description':$('#description').val(), 'name':$('#name').val(), 'allergy':$('#id').val()}};
	if ($('#name').val()=='') {
	ons.notification.alert({
					title: '',
					message: 'Please enter the name of your allergy'
				});
	return false;	
	}
	$.ajax({
		type:  'post',
		url: api_url+"allergies/add",
		dataType: "json", 
		data:  {data:JSON.stringify(add)},
		success: function(result){
        	if (result['status_code']==200) {
				ons.notification.alert({
					title: '',
					message: '"'+$('#name').val()+'" saved succesfully'
				});
				myNavigator.popPage('allergies');
				loadallergies();
			} else {
				ons.notification.alert({
					title: '',
					message: result['message']
				});
				if ( result['status_code']==401 ) {logout();}
			}
    	}
	});
}

function editallergy(id) {
	
	var add = {'data':{'id': localStorage.getItem("id"), 'token':localStorage.getItem("token"), 'allergy':id}};
	
	if (id==0) {
		myNavigator.pushPage('addallergies', { animation: 'none'}); 
		myNavigator.on('postpush', function(event) {
		$('#name').val('');
		$('#description').val('');
		$('#id').val('0');
		});
	} else {
		$.ajax({
			type:  'post',
			url: api_url+"allergies/get",
			dataType: "json", 
			data:  {data:JSON.stringify(add)},
			success: function(result){
				if (result['status_code']==200) {
					myNavigator.pushPage('addallergies', { animation: 'none'}); 
					myNavigator.on('postpush', function(event) {
						$('#name').val(result['result'][0]['allergies_name']);
						$('#description').val(result['result'][0]['allergies_description']);
						$('#id').val(result['result'][0]['allergies_id']);
					});
				} else {
					ons.notification.alert({
						title: '',
						message: result['message']
					});
					if ( result['status_code']==401 ) {logout();}
				}
			}
		});
	}
}

function deleteallergy(id){
	
	
	  ons.notification.confirm({
      message: 'Are you sure you want to remove this element from the list?',
      callback: function(idx) {
        switch(idx) {
          case 0:
            break;
          case 1:	  	
            dodeleteallergies(id);
			break;
		}
	} });

	
}

function dodeleteallergies(id) {
	

var credentials = {'data':{'id': localStorage.getItem("id"), 'token':localStorage.getItem("token"), 'allergy':id}};
	$.ajax({
		type:  'post',
		url: api_url+"allergies/delete",
		dataType: "json", 
		data:  {data:JSON.stringify(credentials)},
		success: function(result){
        	if (result['status_code']==200) {
				loadallergies();
			} else {
				ons.notification.alert({
					title: '',
					message: result['message']
				});
				if ( result['status_code']==401 ) {logout();}
			}
    	}
	});

}


function search_allergy() {
	
	$('#map').hide();
	var doc=$('#pharmacy').val();
	$('#doctorslist').html('<div class="35000dover"></div>');
	var credentials = {'data':{'id': localStorage.getItem("id"), 'token':localStorage.getItem("token"), 'pharmacy':doc}};
	$.ajax({
		type:  'post',
		url: api_url+"pharmacies/search",
		dataType: "json", 
		data:  {data:JSON.stringify(credentials)},
		success: function(result){
        	if (result['status_code']==200) {
				$('#doctorslist').html(result['result']['html'])
			} else {
				ons.notification.alert({
					title: '',
					message: result['message']
				});
				if ( result['status_code']==401 ) {logout();}
				$('#doctorslist').html('');
			}
    	}
	});

	
}


/* prescriptins */

function loadprescriptions(){
	if($('#doctorslist').length) {  } else { myNavigator.pushPage('prescriptions', { animation: 'slide'}); }
	var credentials = {'data':{'id': localStorage.getItem("id"), 'token':localStorage.getItem("token")}};
	$.ajax({
		type:  'post',
		url: api_url+"users/getrxlist",
		dataType: "json", 
		data:  {data:JSON.stringify(credentials)},
		success: function(result){
        	if (result['status_code']==200) {
				$('#doctorslist').html(result['result']['html'])
			} else {
				ons.notification.alert({
					title: '',
					message: result['message']
				});
				if ( result['status_code']==401 ) {logout();}
				$('#doctorslist').html('');
			}
    	}
	});
}

function getmed(id){
	myNavigator.pushPage('get', { animation: 'slide'});
	var credentials = {'data':{'id': localStorage.getItem("id"), 'token':localStorage.getItem("token"), 'prescription':id}};
	$.ajax({
		type:  'post',
		url: api_url+"users/getmed",
		dataType: "json", 
		data:  {data:JSON.stringify(credentials)},
		success: function(result){
        	if (result['status_code']==200) {
				$('#get').html(result['result']['html'])
			} else {
				ons.notification.alert({
					title: '',
					message: result['message']
				});
				if ( result['status_code']==401 ) {logout();}
				$('#doctorslist').html('');
			}
    	}
	});
}

function cancelmed(id){
	
	var credentials = {'data':{'id': localStorage.getItem("id"), 'token':localStorage.getItem("token"), 'prescription':id}};
	ons.notification.confirm({
      message: 'You are going to remove this prescription permanently. If you need this medication, a new prescription will need to be issued by your doctor. Are you sure?',
      callback: function(idx) {
        switch(idx) {
          case 0:
            break;
          case 1:	  	
            $.ajax({
				type:  'post',
				url: api_url+"users/cancelmed",
				dataType: "json", 
				data:  {data:JSON.stringify(credentials)},
				success: function(result){
					if (result['status_code']==200) {
						ons.notification.alert({
							title: '',
							message: 'The prescription has been cancelled.'
						});
						loadprescriptions();
					} else {
						ons.notification.alert({
							title: '',
							message: result['message']
						});
						if ( result['status_code']==401 ) {logout();}
						$('#doctorslist').html('');
					}
				}
			});
			break;
		}
	} });
	
}


// ----------

$(document).ready(function(){    
 

});
