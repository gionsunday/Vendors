var div = document.createElement("div");

div.innerHTML = `<header class="header-area header-sticky">
<nav class="navbar navbar-expand-lg navbar-light bg-light">
        <a class="navbar-brand" href="#">Navbar</a>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
      
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul class="navbar-nav mr-auto">
            <li class="nav-item active">
              <a class="nav-link" href="#">Home <span class="sr-only">(current)</span></a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#">Vendors</a>
            </li>
            <li class="nav-item dropdown">
              <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                Accounts
              </a>
              <div class="dropdown-menu" aria-labelledby="navbarDropdown">
                <a class="dropdown-item" href="signup.html">Signup</a>
                <a class="dropdown-item" href="login.html">Login</a>
                
              </div>
            </li>
            
          </ul>
          <form class="form-inline my-2 my-lg-0">
            <input class="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search">
            <button class="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
          </form>
        </div>
      </nav>
    
</header>
`;

document.currentScript.parentNode.insertBefore(
  div.firstElementChild,
  document.currentScript
);

document.addEventListener("DOMContentLoaded", () => {
    $('head').append('<link rel="stylesheet" href="../css/style.css" type="text/css"/>');
    $('head').append(' <link rel="stylesheet" href="./bootstrap.min.css" type="text/css">')
    
    
   
  });