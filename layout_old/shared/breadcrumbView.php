<?php if (isset($breadcrumb)) { ?>
<!--==============================
    Breadcumb
============================== -->
    <div class="breadcumb-wrapper " data-bg-src="<?php if(isset($breadcrumb['imagem'])){ echo $breadcrumb['imagem']; }?>">
        <div class="container z-index-common">
            <div class="breadcumb-content">
                <h1 class="breadcumb-title"><?php if(isset($breadcrumb['titulo'])){ echo $breadcrumb['titulo']; }?></h1>
                <div class="breadcumb-menu-wrap">
                    <ul class="breadcumb-menu">
                        <li><a href="<?php if(isset($breadcrumb['link-anterior'])){ echo $breadcrumb['link-anterior']; }?>"><<?php if(isset($breadcrumb['pagina-anterior'])){ echo $breadcrumb['pagina-anterior']; }?></a></li>
                        <li><?php if(isset($breadcrumb['titulo'])){ echo $breadcrumb['titulo']; }?></li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
<?php } ?>