<!--==============================
    Cart Area
    ==============================-->
<div class="vs-cart-wrapper  space-extra-bottom">
    <div class="container">
        <h2 class="blog-title">CARRINHO DE COMPRAS</h2>
        <?php if(isset($showPageSubConteudo)){
            include 'sub-conteudo-'.$showPageSubConteudo.'View.php';
        } else {
            echo '<code>Não existe página para o sub-conteudo: '.$showPageSubConteudo.'</code>';
        }
        ?>
    </div>
</div>