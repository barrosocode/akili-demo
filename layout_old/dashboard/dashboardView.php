<!doctype html>
<html class="no-js" lang="pt-BR">

<?php include '..' . DS . 'app' . DS . 'views' . DS . 'shared' . DS . 'headView.php'; ?>

<body class="layout4">
  <!--[if lte IE 9]>
    	<p class="browserupgrade">You are using an <strong>outdated</strong> browser. Please <a href="https://browsehappy.com/">upgrade your browser</a> to improve your experience and security.</p>
  <![endif]-->

  <!--********************************
   		Code Start From Here 
	******************************** -->
  <?php
  //include '..' . DS . 'app' . DS . 'views' . DS . 'shared' . DS . 'loaderView.php';
  include '..' . DS . 'app' . DS . 'views' . DS . 'shared' . DS . 'mobileMenuView.php';
  //include '..' . DS . 'app' . DS . 'views' . DS . 'shared' . DS . 'sideMenuView.php'; -- Não necessário por enquanto
  //include '..' . DS . 'app' . DS . 'views' . DS . 'shared' . DS . 'popupSearchView.php'; -- Não necessário por enquanto
  if (isset($_SESSION['logado']['tipo']) && $_SESSION['logado']['tipo'] == 'aluno') {
    include '..' . DS . 'app' . DS . 'views' . DS . 'dashboard' . DS . 'aluno' . DS . 'headerAlunoCleanView.php';
    include '..' . DS . 'app' . DS . 'views' . DS . 'dashboard' . DS . 'aluno' . DS . 'dashboardAlunoView.php';
  } else {
    include '..' . DS . 'app' . DS . 'views' . DS . 'dashboard' . DS . 'responsavel' . DS . 'headerResponsavelCleanView.php';
    include '..' . DS . 'app' . DS . 'views' . DS . 'dashboard' . DS . 'responsavel' . DS . 'dashboardResponsavelView.php';
  }
  include '..' . DS . 'app' . DS . 'views' . DS . 'shared' . DS . 'footerCleanView.php';
  include '..' . DS . 'app' . DS . 'views' . DS . 'shared' . DS . 'scriptsView.php';
  ?>
  <!--********************************
			Code End  Here 
******************************** -->
</body>

</html>