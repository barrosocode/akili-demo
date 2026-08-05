<!-- activities-section -->
<section class="activities-style1">
    <div class="container-style4">
        <div class="title-area-four active text-center">
            <img src="<?php echo ASSETS_SITE; ?>img/breadcumb/title-img.png" alt="">
            <h2><?php if(isset($cntMetodoNeuro->titulo)){ echo $cntMetodoNeuro->titulo; }?></h2>
        </div>
        <?php if(isset($cntMetodoNeuro->texto)){ echo $cntMetodoNeuro->texto; }?>
    </div>
</section>
<!-- End activities-section -->
<!-- activities-section -->
<section class="activities-style1 mt-5">
    <div class="container-style4">
        <div class="title-area-four active text-center">
            <img src="../asstes-site/img/breadcumb/title-img.png" alt="">
            <h2><?php if(isset($cntEtapasMetodo->titulo)){ echo $cntEtapasMetodo->titulo; }?></h2>
        </div>
        <?php if(isset($cntEtapasMetodo->texto)){ echo $cntEtapasMetodo->texto; }?>
    </div>
</section>
<!-- End activities-section -->