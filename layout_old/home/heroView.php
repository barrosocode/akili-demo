<!--==============================
Hero Area
==============================-->
<!-- hero-wapper-section -->
<section class="vs-hero-wrapper4">
    <div class="banner-slide4" style="background-image: url('<?php echo ASSETS_SITE; ?>img/bg/slide-01.jpg');">
        <div class="banner-slide4-content">
            <div class="container-style4">
                <div class="banner-content4">
                    <h1 class="banner-title"><?php if(isset($cntHero->subtitulo)){ echo $cntHero->titulo;}?></h1>
                    <?php if(isset($cntHero->subtitulo)){ echo $cntHero->texto;}?>
                    <a href="<?php echo WWW; ?>cadastro" title="" class="vs-btn banner"><?php if(isset($cntHero->subtitulo)){ echo $cntHero->frasetitulo;}?></a>
                </div>
            </div>
        </div>
    </div>
</section>
<!-- End hero-wapper -->