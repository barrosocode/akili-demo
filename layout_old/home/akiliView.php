<!-- about-section-four -->
<section class="about-section-four mt-5">
    <div class="container-style4">
        <div class="row">
            <div class="col-lg-6 col-md-12 col-sm-12">
                <div class="about-img-four">
                    <img src="<?php echo ASSETS_SITE; ?>images/sobre/a-plataforma.png" alt="A Plataforma" title="A Plataforma">
                    <!-- <div class="exp-box-four bounce-y">
                            <h4 class="title">100%</h4>
                            <span>A+ Results</span>
                        </div> -->
                </div>
            </div>
            <div class="col-lg-6 col-md-12 col-sm-12">
                <div class="about-content4">
                    <span class="sub-title"><?php if (isset($cntAPlataforma->subtitulo)) {
                                                echo $cntAPlataforma->subtitulo;
                                            } ?></span>
                    <h2><?php if (isset($cntAPlataforma->titulo)) {
                            echo $cntAPlataforma->titulo;
                        } ?></h2>
                    <?php if (isset($cntAPlataforma->texto)) {
                        echo $cntAPlataforma->texto;
                    } ?>
                </div>
            </div>
        </div>
    </div>
</section>
<!-- End about-section -->