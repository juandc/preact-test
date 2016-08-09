var $burguerButton, $menu, $body, gestos

$burguerButton = document.getElementById('burguer-button')
$menu = document.getElementById('menu')

function showMenu(){
  $burguerButton.classList.toggle('fa-bars')
  $menu.classList.add('active')
}
function hideMenu(){
  $burguerButton.classList.toggle('fa-bars')
  $menu.classList.remove('active')
}
function toggleMenu(){
  $burguerButton.classList.toggle('fa-bars')
  $menu.classList.toggle('active')
}

$burguerButton.addEventListener('click', toggleMenu)

// Hammer
$body = document.body
gestos = new Hammer($body)
gestos.on('swiperight', hideMenu)
gestos.on('swipeleft', showMenu)