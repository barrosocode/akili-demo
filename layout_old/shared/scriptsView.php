<!--==============================
        All Js File
    ============================== -->
<!-- Jquery -->
<script src="<?php echo ASSETS_SITE; ?>js/vendor/jquery-3.6.0.min.js"></script>
<script src="<?php echo ASSETS_SITE; ?>js/jquery.waypoints.min.js"></script>
<script src="<?php echo ASSETS_SITE; ?>js/jquery.counterup.min.js"></script>
<script src="<?php echo ASSETS_SITE; ?>js/jquery.fancybox.js"></script>
<!-- Slick Slider -->
<script src="<?php echo ASSETS_SITE; ?>js/slick.min.js"></script>
<!-- <script src="<?php echo ASSETS_SITE; ?>js/app.min.js"></script> -->
<!-- Layerslider -->
<script src="<?php echo ASSETS_SITE; ?>js/layerslider.utils.js"></script>
<script src="<?php echo ASSETS_SITE; ?>js/layerslider.transitions.js"></script>
<script src="<?php echo ASSETS_SITE; ?>js/layerslider.kreaturamedia.jquery.js"></script>
<!-- jquery ui -->
<script src="<?php echo ASSETS_SITE; ?>js/jquery-ui.min.js"></script>
<!-- Bootstrap -->
<script src="<?php echo ASSETS_SITE; ?>js/bootstrap.min.js"></script>
<!-- Magnific Popup -->
<script src="<?php echo ASSETS_SITE; ?>js/jquery.magnific-popup.min.js"></script>
<!-- Isotope Filter -->
<script src="<?php echo ASSETS_SITE; ?>js/imagesloaded.pkgd.min.js"></script>
<script src="<?php echo ASSETS_SITE; ?>js/isotope.pkgd.min.js"></script>
<!-- Main Js File -->
<script src="<?php echo ASSETS_SITE; ?>js/datecounter.js"></script>
<script src="<?php echo ASSETS_SITE; ?>js/main.js"></script>
<!-- Dashboard -->
<script>
    $(document).ready(function() {
        $("#botao-display-form-aluno").click(function(e) {
            e.preventDefault(); // Evita o comportamento padrão do link
            $("#form-dados-aluno").toggle(); // Alterna a visibilidade do formulário
        });
    });
    document.addEventListener("DOMContentLoaded", function() {
        const cepInput = document.querySelector("input[name='cep']");
        const logradouroInput = document.querySelector("input[name='logradouro']");
        const bairroInput = document.querySelector("input[name='bairro']");
        const cidadeInput = document.querySelector("input[name='cidade']");
        const ufInput = document.querySelector("input[name='uf']");

        cepInput.addEventListener("input", function() {
            let cep = this.value.replace(/\D/g, ""); // Remove caracteres não numéricos

            if (cep.length === 8) {
                cepInput.classList.add("loading");
                fetch(`https://viacep.com.br/ws/${cep}/json/`)
                    .then(response => response.json())
                    .then(data => {
                        if (!data.erro) {
                            logradouroInput.value = data.logradouro || "";
                            bairroInput.value = data.bairro || "";
                            cidadeInput.value = data.localidade || "";
                            ufInput.value = data.uf || "";
                        } else {
                            alert("CEP não encontrado!");
                        }
                    })
                    .catch(error => console.error("Erro ao buscar CEP:", error))
                    .finally(() => {
                        cepInput.classList.remove("loading");
                    });
            }
        });
    });
    document.addEventListener("DOMContentLoaded", function() {
        const botoesAlternativas = document.querySelectorAll('input[name="alternativa"]');
        const botaoVerificar = document.getElementById("verificarResposta");

        botoesAlternativas.forEach(botao => {
            botao.addEventListener("change", function() {
                botaoVerificar.style.display = "block"; // Exibe o botão quando uma alternativa for selecionada
            });
        });
    });
</script>
<!-- Accessibility Code for "akilieduc.com.br" -->
<script>
    window.interdeal = {
        get sitekey() {
            return "3dcff1125aa522b4623e313e362427e5"
        },
        get domains() {
            return {
                "js": "https://cdn.equalweb.com/",
                "acc": "https://access.equalweb.com/"
            }
        },
        "Position": "left",
        "Menulang": "PT",
        "draggable": true,
        "btnStyle": {
            "vPosition": [
                "20",
                "20"
            ],
            "margin": [
                "0",
                "0"
            ],
            "scale": [
                "0.5",
                "0.5"
            ],
            "color": {
                "main": "#000000",
                "second": "#ffffff"
            },
            "icon": {
                "outline": true,
                "outlineColor": "#ffffff",
                "type": 1,
                "shape": "circle"
            }
        },
        "showTooltip": true,

    };

    (function(doc, head, body) {
        var coreCall = doc.createElement('script');
        coreCall.src = interdeal.domains.js + 'core/5.1.16/accessibility.js';
        coreCall.defer = true;
        coreCall.integrity = 'sha512-VO6taeNzVSM5l7eUCH78sdXwiorY7vLl2t8tJMD1KHA2FiHaW7SpZqvkF4lFZ0SgWj7AaAkSPJwQ5LEM1MccaA==';
        coreCall.crossOrigin = 'anonymous';
        coreCall.setAttribute('data-cfasync', true);
        body ? body.appendChild(coreCall) : head.appendChild(coreCall);
    })(document, document.head, document.body);
</script>

<!--- Cadastro aluno -->
<script>
    (function() {
        const form = document.getElementById('formCadastroAluno');
        const input = form.querySelector('input[name="loginaluno"]');
        const error = document.getElementById('loginError');
        const regex = /^[A-Za-z0-9_-]+$/;

        function validate() {
            const v = input.value.trim();
            const ok = v.length > 0 && regex.test(v);
            error.style.display = ok ? 'none' : 'block';
            input.classList.toggle('is-invalid', !ok);
            input.classList.toggle('is-valid', ok);
            return ok;
        }

        // Validação ao digitar/colar
        input.addEventListener('input', validate);

        // Bloqueia submit se inválido
        form.addEventListener('submit', function(e) {
            if (!validate()) {
                e.preventDefault();
                input.focus();
            }
        });
    })();


    document.getElementById('cadastrar-aluno').addEventListener('click', function() {
        // Esconde o botão
        this.style.display = 'none';

        // Mostra a div
        var box = document.getElementById('form-dados-aluno');
        box.style.display = 'block';

        // (opcional) rolar até o formulário e focar no primeiro campo
        box.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
        var first = box.querySelector('input,select,textarea,button');
        if (first) first.focus();
    });
</script>