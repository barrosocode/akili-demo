<!--==============================
    Sidemenu HEAD RESPONSAVEL
    ============================== -->
<div class="sidemenu-wrapper d-none d-lg-block">
    <div class="sidemenu-content">
        <button class="closeButton sideMenuCls"><i class="far fa-times"></i></button>
        <div class="widget  ">
            <div class="widget-about">
                <div class="footer-logo">
                    <img src="<?php echo ASSETS_SITE; ?>images/logo-akili-positivo.png" alt="Logo Akili" titke="Logo Akili">
                </div>
                <p class="mb-0">We are constantly expanding the range of services offered, taking care of children
                    of all ages.</p>
            </div>
        </div>
        <div class="widget  ">
            <h3 class="widget_title">Get In Touch</h3>
            <div>
                <p class="footer-text">Monday to Friday: <span class="time">8.30am – 02.00pm</span></p>
                <p class="footer-text">Saturday, Sunday: <span class="time">Close</span></p>
                <p class="footer-info"><i class="fal fa-envelope"></i>Email: <a
                        href="mailto:user@domainname.com">user@domainname.com</a></p>
                <p class="footer-info"><i class="fas fa-mobile-alt"></i>Phone: <a href="tel:+4402076897888">+44 (0)
                        207 689 7888</a></p>
            </div>
        </div>
        <div class="widget  ">
            <h3 class="widget_title">Latest News</h3>
            <div class="recent-post-wrap">
                <div class="recent-post">
                    <div class="media-img">
                        <a href="blog-details.html"><img src="<?php echo ASSETS_SITE; ?>img/blog/recent-post-1-1.jpg"
                                alt="Blog Image"></a>
                    </div>
                    <div class="media-body">
                        <div class="recent-post-meta">
                            <a href="blog.html"><i class="far fa-calendar-alt"></i>December 3, 2022</a>
                        </div>
                        <h4 class="post-title"><a class="text-inherit" href="blog-details.html">A very warm welcome
                                to our new Treasurer</a></h4>
                    </div>
                </div>
                <div class="recent-post">
                    <div class="media-img">
                        <a href="blog-details.html"><img src="<?php echo ASSETS_SITE; ?>img/blog/recent-post-1-2.jpg"
                                alt="Blog Image"></a>
                    </div>
                    <div class="media-body">
                        <div class="recent-post-meta">
                            <a href="blog.html"><i class="far fa-calendar-alt"></i>February 15, 2022</a>
                        </div>
                        <h4 class="post-title"><a class="text-inherit" href="blog-details.html">German kinder and
                                garten mean child</a></h4>
                    </div>
                </div>
                <div class="recent-post">
                    <div class="media-img">
                        <a href="blog-details.html"><img src="<?php echo ASSETS_SITE; ?>img/blog/recent-post-1-3.jpg"
                                alt="Blog Image"></a>
                    </div>
                    <div class="media-body">
                        <div class="recent-post-meta">
                            <a href="blog.html"><i class="far fa-calendar-alt"></i>Augest 20, 2022</a>
                        </div>
                        <h4 class="post-title"><a class="text-inherit" href="blog-details.html">English uses term to
                                refer to the earliest</a></h4>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<!--==============================
        Header Area Clean
    ==============================-->
<header class="vs-header header-layout4">
    <div class="header-top4">
    </div>
    <div class="sticky-wrap">
        <div class="sticky-active">
            <div class="container-style4">
                <div class="header-lower4">
                    <div class="row gx-3 align-items-center justify-content-between">
                        <div class="col-8 col-sm-auto">
                            <div class="header-logo2">
                                <a href="<?php echo WWW; ?>dashboard">
                                    <img src="<?php echo ASSETS_SITE; ?>images/logo-akili-positivo.png" alt="Logo Akili">
                                </a>
                            </div>
                        </div>
                        <div class="col">
                            <div class="row">
                                <div class="col-sm-6">
                                    <span style="font-size:15px">Bem vindo(a), <a href="<?php echo WWW; ?>dashboard/meus-dados">
                                            <?php if (isset($_SESSION['logado']['responsavel']['nome'])) {
                                                echo $_SESSION['logado']['responsavel']['nome'];
                                            }; ?>
                                            <?php if (isset($_SESSION['logado']['aluno']['nome'])) {
                                                echo $_SESSION['logado']['aluno']['nome'];
                                            }; ?>
                                        </a></span>
                                </div>
                            </div>
                        </div>
                        <div class="col-auto  d-none d-lg-block">
                            <div class="header-icons4">

                                <a href="<?php echo WWW; ?>dashboard/carrinho-de-compras" title="" class="simple-icon cart"><i class="fa fa-shopping-cart"></i><span>R$ <?php function formatarMoeda($valor)
                                                                                                                                                                        {
                                                                                                                                                                            // Formata o valor para o formato 'R$ 3.000,00'
                                                                                                                                                                            return number_format($valor, 2, ',', '.');
                                                                                                                                                                        }
                                                                                                                                                                        if (isset($carrinho->preco_total) && $carrinho->preco_total != null) { ?><?php echo formatarMoeda($carrinho->preco_total); ?><?php } else {
                                                                                                                                                                                                                                                                                                        echo '0,00';
                                                                                                                                                                                                                                                                                                    } ?></span></a>
                                <a href="<?php echo WWW; ?>logout" title="" class="simple-icon cart" style="margin-left:20px"><i class="fas fa-sign-out-alt"></i> Sair</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</header>