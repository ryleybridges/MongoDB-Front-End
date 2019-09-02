let serverKey;
let serverPort;
let editing = false;

  $.ajax({
    url: 'config.json',
    type: 'GET',
    dataType: 'json',
    success: function(keys){
      serverKey = keys['SERVER_URL'];
      serverPort = keys['SERVER_PORT'];
      getProductsData();
    },
    error: function(){
      console.log('cannot find config.json file, cannot run application');
    }
  });

  getProductsData = () => {
    $.ajax({
      url:  `${serverKey}:${serverPort}/allProducts`,
      type: 'GET',
      dataType: 'json',
      success: function(data){
        $('#productList').empty();
        for (var i = 0; i < data.length; i++) {
          let product = `<li class="list-group-item d-flex justify-content-between align-items-center productItem" data-id=${data[i]._id}>
                              <span class="productName">${data[i].name}</span>`
                              if(sessionStorage['userName']){
                                product += `<div>
                                              <button class="btn btn-info editBtn">Edit</button>
                                              <button class="btn btn-danger removeBtn">Remove</button>
                                            </div>`;
                              }

                          product += `</li>`;
              $('#productList').append(product);
          }
      },
      error: function(){
        console.log('it is not working');
      }
    });
  }

  $('#productList').on('click', '.editBtn', function(){
    event.preventDefault();
    const id = $(this).parent().parent().data('id');
    console.log(id);
    console.log('button has been clicked');
    $.ajax({
      url: `${serverKey}:${serverPort}/product/${id}`,
      type: 'GET',
      dataType: 'json',
      success:function(product){
        console.log(product);
        $('.productName').val(product['name']);
        $('.productPrice').val(product['price']);
        $('#productID').val(product['_id']);
        $('#addProduct').text('Edit Product').addClass('btn-warning');
        $('#heading').text('Edit Product');
        editing = true;
      },
      error:function(err){
        console.log(err);
        console.log('it is not working');
      }
    });
  });

  $('#productList').on('click', '.removeBtn', function(){
    event.preventDefault();
    const id = $(this).parent().parent().data('id');
    $.ajax({
      url: `${serverKey}:${serverPort}/products/${id}`,
      type: 'DELETE',
      success:function(result){
        const allProducts = $('.productItem');
        allProducts.each(function(){
          console.log($(this).data('id'));
          if($(this).data('id') === id){
            $(this).remove();
          }
        });
      },
      error: function(err){
        console.log(err);
        console.log('something went wrong deleting the product');
      }
    });
  });

  $('#addProduct').click(function(){
    event.preventDefault();
    // console.log('button has been clicked');
    let productName = $('.productName').val();
    let productPrice = $('.productPrice').val();
    if(productName === ''){
      console.log('please enter a thing');
    }else if(productPrice === ''){
      console.log('please enter a cost');
    }else {
      if(editing === true){
        const id = $('#productID').val();
        $.ajax({
          url: `${serverKey}:${serverPort}/editProduct/${id}`,
          type: 'PATCH',
          data: {
            name: productName,
            price: productPrice
          },
          success:function(result){
            console.log(`Edited ${productName} to be $${productPrice}`);
            $('.productName').val(null);
            $('.productPrice').val(null);
            $('#productID').val(null);
            $('#addProduct').text('Add Product').removeClass('btn-warning');
            $('#heading').text('Add Product');
            editing = false;
            const allProducts = $('.productItem');
            allProducts.each(function(){
              console.log($(this).data('id'));
              if($(this).data('id') === id){
                $(this).find('.productName').text(productName);
              }
            });
          },
          error:function(err){
            console.log(err);
            console.log('something went wrong');
          }
        });
      }else {
        console.log(`${productName} costs $${productPrice}`);
        $.ajax({
          url: `${serverKey}:${serverPort}/product`,
          type: 'POST',
          data: {
              name: productName,
              price: productPrice
          },
          success: function(result){
            $('#productList').append(`<li class="list-group-item d-flex justify-content-between align-items-center productItem">
                                  <span class="productName">${result.name}</span>
                                    <div>
                                    <button class="btn btn-info editBtn">Edit</button>
                                    <button class="btn btn-danger removeBtn">Remove</button>
                                    </div>
                                  </li>`);
            $('.productName').val(null);
            $('.productPrice').val(null);
          },
          error: function(error){
            console.log(error);
            console.log('something went wrong');
          }
        });
      }
    }
  });

  $('#contactButton').click(function(){
    event.preventDefault();
    let contactName = $('.contactName').val();
    let contactEmail = $('.contactEmail').val();
    let contactSubject = $('.contactSubject').val();
    let contactMessage = $('.contactMessage').val();
    if(contactName === ''){
      console.log('please enter a name');
    }else if(contactEmail === ''){
      console.log('please enter an email');
    }else if(contactSubject === ''){
      console.log('please enter a subject');
    }else if(contactMessage === ''){
      console.log('please enter a message');
    }else {
      $.ajax({
        url: `${serverKey}:${serverPort}/contact`,
        type: 'POST',
        dataType: 'json',
        data: {
            name: contactName,
            email: contactEmail,
            subject: contactSubject,
            message: contactMessage
        },
        success: function(result){
          console.log(result);
        },
        error: function(error){
          console.log(error);
          console.log('something went wrong');
        }
      });
    }
});

$('#loginTabBtn').click(function(){
    event.preventDefault();
    $('.nav-link').removeClass('active');
    $(this).addClass('active');
    $('#loginForm').show();
    $('#registerForm').hide();
});

$('#registerTabBtn').click(function(){
    event.preventDefault();
    $('.nav-link').removeClass('active');
    $(this).addClass('active');
    $('#loginForm').hide();
    $('#registerForm').removeClass('d-none').show();
});

$('#registerForm').submit(function(){
  event.preventDefault();
  // console.log('register has been clicked');
  const username = $('#rUsername').val();
  const email = $('#rEmail').val();
  const password = $('#rPassword').val();
  const confirmPassword = $('#rConfirmPassword').val();
  if(username.length === 0){
    console.log('please enter a username');
  }else if(email.length === 0){
    console.log('please enter an email');
  }else if(password.length === 0){
    console.log('please enter a password');
  }else if(confirmPassword.length === 0){
    console.log('please confirm password');
  }else if(password !== confirmPassword){
    console.log('your password does not match your confirm password');
  }else {
    console.log('good to go!');
    $.ajax({
      url: `${serverKey}:${serverPort}/users`,
      type: 'POST',
      data: {
        username: username,
        email: email,
        password: password
      },
      success:function(result){
        console.log(result);
      },
      error:function(err){
        console.log(err);
        console.log('something went wrong with registering a new user');
      }
    });
  }
});

$('#loginForm').submit(function(){
  event.preventDefault();
  const username = $('#lUsername').val();
  const password = $('#lPassword').val();
  if(username.length === 0){
    console.log('please enter a username');
  }else if(password.length === 0){
    console.log('please enter a password');
  }else {
    $.ajax({
      url: `${serverKey}:${serverPort}/getUser`,
      type: 'POST',
      data: {
        username: username,
        password: password
      },
      success: function(result){
        if(result === 'invalid user'){
          console.log('cannot find user with that username');
        }else if(result === 'invalid password'){
          console.log('password is incorrect');
        }else {
          console.log('let us log you in');
          console.log(result);

          sessionStorage.setItem('userId', result['_id']);
          sessionStorage.setItem('userName', result['username']);
          sessionStorage.setItem('userEmail', result['email']);
          getProductsData();
          $('#authForm').modal('hide');
          $('#loginBtn').hide();
          $('#logoutBtn').removeClass('d-none');
          $('#addProductSection').removeClass('d-none');
        }
      },
      error: function(err){
        console.log(err);
        console.log('there was an error with logging in');
      }
    });
  }
});

$('#logoutBtn').click(function(){
  sessionStorage.clear();
  getProductsData();
  $('#loginBtn').show();
  $('#logoutBtn').addClass('d-none');
  $('#addProductSection').addClass('d-none');
});

$(document).ready(function(){
  // $('#authForm').modal('show');
  console.log(sessionStorage);

  if(sessionStorage['userName']){
    console.log('you are logged in');
    $('#loginBtn').hide();
    $('#logoutBtn').removeClass('d-none');
    $('#addProductSection').removeClass('d-none');
  }else {
    console.log('please sign in');
  }
});
