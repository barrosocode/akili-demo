<!-- about-section-four -->
<section class="about-section-four mt-5">
    <div class="container-style4">
        <div class="row">
            <div class="col-lg-6 col-md-12 col-sm-12">
                <div class="about-content4">
                    <span class="sub-title"><?php if(isset($cntSobreNos->subtitulo)){ echo $cntSobreNos->subtitulo; }?></span>
                    <h2><?php if(isset($cntSobreNos->titulo)){ echo $cntSobreNos->titulo; }?></h2>
                    <?php if(isset($cntSobreNos->texto)){ echo $cntSobreNos->texto; }?>
                </div>
            </div>
            <div class="col-lg-6 col-md-12 col-sm-12">
                <div class="about-img-four">
                    <img src="<?php echo ASSETS_SITE; ?>images/sobre/sobre-nos.png" alt="Sobre Nós" title="Sobre Nós">
                    <!-- <div class="exp-box-four bounce-y">
                            <h4 class="title">100%</h4>
                            <span>A+ Results</span>
                        </div> -->
                </div>
            </div>
        </div>
    </div>
</section>
<!-- End about-section -->