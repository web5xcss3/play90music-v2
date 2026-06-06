/*=========================================================================
 PLAY 90 MUSIC - APP.JS (UI & SPA STRUCTURE) BY WEB5XCSS3 - W53 DEVELOPMENT
===========================================================================*/

// ========================
// TITLE SYSTEM (SEO + SPA)
// ========================
window.BASE_TITLE = 'Play 90 Music';

window.updatePageTitle = function(data = null, type = '') {

    let title = '';

    if (!data) {
        title = `${BASE_TITLE} | Hits dos Anos 90, Playlists e Rádio Online`;
    } else {

        switch (type) {

            case 'song':
                title = `${data.artist} - ${data.title} (${data.year}) | ${BASE_TITLE}`;
                break;

            case 'artist':
                title = `${data.artist} - Artista | ${BASE_TITLE}`;
                break;

            case 'album':
                title = `${data.title} - Álbum (${data.year}) | ${BASE_TITLE}`;
                break;

            case 'genre':
                title = `${data} - Gênero | ${BASE_TITLE}`;
                break;

            case 'label':
                title = `${data} - Selo | ${BASE_TITLE}`;
                break;

            case 'search':
                title = `Busca: "${data}" | ${BASE_TITLE}`;
                break;

            default:
                title = `${BASE_TITLE}`;
        }
    }

    document.title = title;
};

// Header Component
function Header() {
    return `
			<!-- Header -->
			<header id="header" class="alt">
				<!-- Logo -->
				<div class="logo">
					<a href="index.html">
						<picture>
							<source srcset="https://cdn.jsdelivr.net/gh/web5xcss3/hil_w53/gradient.svg" media="(max-width: 767px)">
							<img src="https://cdn.jsdelivr.net/gh/web5xcss3/hil_w53/gradient.svg" alt="Play 90 Music" />
						</picture>
					</a>
					<ul class="icons">
						<li><button type="button" class="icon solid fa-bars md-ripples ripples-light menuToogle"></button></li>
					</ul>
				</div>

            <!-- Search -->
				<nav id="search">
					<ul>
						<li>
							<form class="search">
								<input type="text" id="searchInput" placeholder="Pesquise Albuns, Artistas, CD, Maxi-Single, Vinyl, Selos, Timeline...">
								<div id="searchDropdown" class="dropdown-results"></div>
							</form>
						</li>
					</ul>
				</nav>

            <!-- Nav -->
				<nav id="nav">
					<ul class="icons">
						<li class="alt"><button type="button" class="icon solid fa-magnifying-glass md-ripples ripples-light"></button></li>
						<li><button type="button" id="openSubmitAlbum" class="upload-album-btn button">Enviar Álbum</button></li>
						<li>
							<button type="button" class="toggle-dropdown icon solid fa-ellipsis-vertical md-ripples ripples-light"></button>
							<ul class="dropotron level-0">
								<li><button type="button" data-toggle="fullscreen" class="md-ripples ripples-light">Modo Fullscreen</button></li>
								<li><button type="button" id="toggleBanner" class="md-ripples ripples-light">Background Image</button></li>
							</ul>
						</li>
					</ul>
				</nav>

			</header>
		`;
}

// Menu Component
function Menu() {
    return `
			<!-- Menu -->
			<section id="menu">
				<ul class="menu">
					<li><button type="button" class="active md-ripples ripples-light" data-tab="home"><i class="icon solid fa-house"></i><span class="label">Início</span></button></li>
					<li><button type="button" class="md-ripples ripples-light" data-tab="timeline"><i class="icon solid fa-compass"></i><span class="label">Explorar</span></button></li>
					<li><button type="button" class="md-ripples ripples-light" data-tab="artists"><i class="icon solid fa-chart-simple"></i><span class="label">Biblioteca</span></button></li>
				</ul>
			</section>
		`;
}

// Banner Component
function Banner() {
    return `
			<!-- Banner -->
			<section id="banner">
				<div class="image filtered" data-position="center"></div>
			</section>
		`;
}

// Home Content Component
function HomeContent() {
    return `
        <!-- Content Home Tab -->
			<div id="home" class="tab-content active">
			
            <!-- Destaque -->
				<section class="wrapper style">
					<header class="major">
						<h2 id="featuredTitle"></h2>
						<div class="slick-actions">
							<div id="new-slick-arrow" class="slick-arrows"></div>
						</div>
					</header>
					<div id="featuredAlbums"></div>
				</section>
				
			<!-- Day Titulos -->
				<section class="wrapper style">
					<!--
					<header class="major">
						<h2 id="dailyFeaturedTitle"></h2>
					</header>
					-->
					<div class="daily-slider-wrap">
						<div id="dailyFeaturedTitles"></div>
						<div id="daily-slick-arrow" class="daily-hero-nav"></div>
					</div>
				</section>
				
			<!-- Videos Home -->
				<section class="wrapper style">
					<header class="major">
						<h2 id="homeVideosTitle"></h2>
						<div class="slick-actions">
							<div id="homeVideos-slick-arrow" class="slick-arrows"></div>
						</div>
					</header>
					<div id="homeVideos"></div>
				</section>
            
			<!-- Arists Home -->
				<section class="wrapper style top-artists-section">
					<header class="major">
						<h2 id="topArtistsHomeTitle"></h2>
						<div class="slick-actions">
							<div id="topArtists-slick-arrow" class="slick-arrows"></div>
						</div>
					</header>
					<div id="topArtistsHome"></div>
				</section>

            <!-- DJS -->
				<section class="wrapper style">
					<header class="major">
						<h2 id="featuredDjsTitle"></h2>
						<div class="slick-actions">
							<div id="djs-slick-arrow" class="slick-arrows"></div>
						</div>
					</header>
					<div id="featuredDjs"></div>
				</section>
            
            <!-- Recent -->
				<section class="wrapper style">
					<header class="major">
						<h2 id="recentlyPlayedTitle"></h2>
						<div class="slick-actions">
							<div id="recentlyPlayed-slick-arrow" class="slick-arrows"></div>
						</div>
					</header>
					<div id="recentlyPlayed"></div>
				</section>
			</div>
		`;
}

// Artists Component
function ArtistsContent() {
    return `
        <!-- Artists Tab -->
			<section id="artists" class="tab-content">
				<article id="action">
					<header class="major">
						<div class="library-info">
							<h2 id="libraryTitle"></h2>
							<p id="libraryTitleDesc"></p>
						</div>
						<div class="slick-actions">
							<div id="action-slick-arrow" class="slick-arrows"></div>
						</div>
					</header>
					<ul class="actions action-slider">
						<li><button type="button" class="button md-ripples ripples-light" data-tab="videos">Vídeos</button></li>
						<li><button type="button" class="button md-ripples ripples-light" data-tab="musics">Músicas</button></li>
						<li><button type="button" class="button md-ripples ripples-light" data-tab="playlists">Playlists</button></li>
						<li><button type="button" class="button md-ripples ripples-light" data-tab="albums">Álbuns</button></li>
						<li><button type="button" class="button md-ripples ripples-light" data-tab="singles">CD, Maxi-Single</button></li>
						<li><button type="button" class="button md-ripples ripples-light" data-tab="vinyls">Vinyl, 12"</button></li>
						<li><button type="button" class="button md-ripples ripples-light" data-tab="djs">Mix de D'J'S</button></li>
						<li><button type="button" class="button md-ripples ripples-light" data-tab="instrumental">Instrumental</button></li>
						<li><button type="button" class="button md-ripples ripples-light" data-tab="labels">Labels / Selos</button></li>
					</ul>
				</article>
				<header class="major">
					<h2 id="artistsTitle">Artistas</h2>
				</header>
				<div id="allArtists" class="grid col-6"></div>
			</section>
		`;
}

// Artists Component
function suballAlbumsContent() {
    return `
	<section id="subalbums" class="tab-content">

		<main class="artist-page column">

			<!-- LEFT -->
			<div class="artist-left">
				<img id="artistImage" src="" alt="">
				<header="align-left">
					<h2 id="artistName"></h2>
					<p id="artist-bio"></p>
					<ul class="actions align-middle">
						<li><button type="button" id="playMusic" class="button small md-ripples ripples-light">Music</button></li>
						<li><button type="button" id="playVideos" class="button small md-ripples ripples-light">Videos</button></li>
						<li><button type="button" id="playLyrics" class="button small md-ripples ripples-light">Lyrics</button></li>
					</ul>
				</header>
			</div>

			<!-- RIGHT -->
			<div class="artist-right">
				<header class="major">
					<h2 id="subalbumsTitle"></h2>
					<ul class="actions">
						<li><button type="button" id="backToArtistsBtn" class="button icon solid fa-arrow-left md-ripples ripples-light">Voltar</button></li>
					</ul>
				</header>
				<div id="suballAlbums" class="album-list"></div>
			</div>

		</main>

	</section>
	`;
}

// Timeline Component
function timelineContent() {
    return `
		<!-- Timeline Tab -->
			<section id="timeline" class="tab-content">
				
				<!-- All Timeline -->
				<div class="wrapper style">
					<header class="major">
						<div class="timeline-info">
							<h2 id="timelineTitle"></h2>
							<p id="timelineTitleDesc"></p>
						</div>
						<div class="slick-actions">
							<div id="timeline-slick-arrow" class="slick-arrows"></div>
						</div>
					</header>
					<div id="allTimeline"></div>
				</div>

				<!-- Genres -->
				<div id="genres" class="wrapper style">
					<header class="major">
						<h2 id="genresTitle"></h2>
					</header>
					<div id="AllGenres" class="grid col-4"></div>
				</div>
			</section>
			
		`;
}

// Genres Component
function genresContent() {
    return `
		<!-- Genres Albums Tab -->
			<section id="genresAlbums" class="tab-content">
				<header class="major">
					<h2 id="genresAlbumsTitle"></h2>
					<ul class="actions">
						<li><button type="button" id="backToTimelineFromGenres" class="button icon solid fa-arrow-left md-ripples ripples-light">Voltar</button></li>
					</ul>
				</header>
				<div id="genresAlbumsList" class="grid col-6"></div>
			</section>
		`;
}

// Year Albums Component
function yearAlbumsContent() {
    return `
		<!-- Year Albums Tab -->
			<section id="yearAlbums" class="tab-content">
				<header class="major">
					<h2 id="yearAlbumsTitle"></h2>
					<ul class="actions">
						<li><button type="button" id="backToTimelineBtn" class="button icon solid fa-arrow-left md-ripples ripples-light">Voltar</button></li>
					</ul>
				</header>
				<div id="yearAlbumsList" class="grid col-6"></div>
			</section>
		`;
}

// Music Component
function musicsContent() {
    return `
		<!-- Music -->
			<section id="musics" class="tab-content">
				<header class="major">
					<h2 id="musicsTitle"></h2>
					<ul class="actions">
						<li><button type="button" id="backToMusicsBtn" class="button icon solid fa-arrow-left md-ripples ripples-light">Voltar</button></li>
					</ul>
				</header>
				<div id="allMusics" class="grid col-6"></div>
			</section>
		`;
}

// Playlists Component
function playlistsContent() {
    return `
		<!-- Playlists -->
			<section id="playlists" class="tab-content">
				<header class="major">
					<h2 id="playlistsTitle"></h2>
					<ul class="actions">
						<li><button type="button" id="backToPlaylistsBtn" class="button icon solid fa-arrow-left md-ripples ripples-light">Voltar</button></li>
					</ul>
				</header>
				<div id="allPlaylists" class="grid col-6"></div>
			</section>
		`;
}

// Álbuns Component
function albumsContent() {
    return `
		<!-- Álbuns Tab -->
			<section id="albums" class="tab-content">
				<header class="major">
					<h2 id="albumsTitle"></h2>
					<ul class="actions">
						<li><button type="button" id="backToAlbunsBtn" class="button icon solid fa-arrow-left md-ripples ripples-light">Voltar</button></li>
					</ul>
				</header>
				<div id="allAlbums" class="grid col-6"></div>
			</section>
		`;
}

// Single Component
function singlesContent() {
    return `
		<!-- Single Tab -->
			<section id="singles" class="tab-content">
				<header class="major">
					<h2 id="singlesTitle"></h2>
					<ul class="actions">
						<li><button type="button" id="backToSingleBtn" class="button icon solid fa-arrow-left md-ripples ripples-light">Voltar</button></li>
					</ul>
				</header>
				<div id="allSingles" class="grid col-6"></div>
			</section>
		`;
}

// Vinyl Component
function vinylsContent() {
    return `
		<!-- Vinyl Tab -->
			<section id="vinyls" class="tab-content">
				<header class="major">
					<h2 id="vinylsTitle"></h2>
					<ul class="actions">
						<li><button type="button" id="backToVinylBtn" class="button icon solid fa-arrow-left md-ripples ripples-light">Voltar</button></li>
					</ul>
				</header>
				<div id="allVinyls" class="grid col-6"></div>
			</section>
		`;
}

// Djs Component
function djsContent() {
    return `
		<!-- Djs Tab -->
			<section id="djs" class="tab-content">
				<header class="major">
					<h2 id="djsTitle"></h2>
					<ul class="actions">
						<li><button type="button" id="backToDjsBtn" class="button icon solid fa-arrow-left md-ripples ripples-light">Voltar</button></li>
					</ul>
				</header>
				<div id="allDjs" class="grid col-6"></div>
			</section>
		`;
}

// Instrumental Component
function instrumentalContent() {
    return `
		<!-- Instrumental Tab -->
			<section id="instrumental" class="tab-content">
				<header class="major">
					<h2 id="instrumentalTitle"></h2>
					<ul class="actions">
						<li><button type="button" id="backToInstrumentaisBtn" class="button icon solid fa-arrow-left md-ripples ripples-light">Voltar</button></li>
					</ul>
				</header>
				<div id="allInstrumentals" class="grid col-6"></div>
			</section>
		`;
}

// Videos Component
function videosContent() {
    return `
        <section id="videos" class="tab-content">
			<div class="yt-videos wrapper style">
				<header class="major">
					<h2 id="videosTitle">Vídeos</h2>
					<ul class="actions">
						<li><button type="button" id="backToVideos" class="button icon solid fa-arrow-left md-ripples ripples-light">Voltar</button></li>
					</ul>
				</header>

				<div id="allVideos" class="grid col-6"></div>
			</div>
			
			<div class="yt-videos-artist-albums wrapper style">
				<header class="major align-top">
					<h2 id="videosArtistAlbumsTitle"></h2>
				</header>

				<div id="videosArtistAlbums" class="grid col-6"></div>
			</div>
        </section>
    `;
}

// Labels Component
function labelsContent() {
    return `
		<!-- Labels Tab -->
			<section id="labels" class="tab-content">
				<header class="major">
					<h2 id="labelsTitle"></h2>
					<ul class="actions">
						<li><button type="button" id="backToHomeFromLabels" class="button icon solid fa-arrow-left md-ripples ripples-light">Voltar</button></li>
					</ul>
				</header>
				<div id="labelsList" class="grid col-6"></div>
			</section>
		`;
}

// Sub Labels Component
function labelDetailsContent() {
    return `
		<!-- Sub Labels Tab -->
			<section id="labelDetails" class="tab-content">
				<header class="major">
					<h2 id="labelTitle"></h2>
					<ul class="actions">
						<li><button type="button" id="backToLabelsBtn" class="button icon solid fa-arrow-left md-ripples ripples-light">Voltar</button></li>
					</ul>
				</header>
				<div id="labelArtistsList" class="grid col-6"></div>
			</section>
		`;
}

// Submit Album Component
function submitAlbumContent() {
    return `
        <section id="submitAlbum" class="tab-content">

            <section class="public-submit">

                <header class="major">
                    <h2>Enviar Álbum</h2>
                    <p>
                        Envie um álbum para análise.
                        Após aprovação ele poderá aparecer na Play90 Music.
                    </p>
                </header>

                <form id="publicSubmitForm" enctype="multipart/form-data">

                    <div class="form-group">
                        <label for="publicType">Categoria</label>
                        <select id="publicType" name="type" required>
                            <option value="albums">Albums</option>
                            <option value="singles">Singles</option>
                            <option value="vinyls">Vinyls</option>
                            <option value="djs">DJs</option>
                            <option value="musics">Musics</option>
                            <option value="playlists">Playlists</option>
                            <option value="instrumental">Instrumental</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label for="publicArtist">Artista</label>
                        <input type="text" id="publicArtist" name="artist" placeholder="Ex: 2 Unlimited" required>
                    </div>

                    <div class="form-group full">
                        <label for="publicTitle">Título</label>
                        <input type="text" id="publicTitle" name="title" placeholder="Ex: No Limit (CD, Maxi-Single, Germany 1993)" required>
                    </div>

                    <div class="form-group full">
                        <label for="publicEmbedUrl">Embed URL</label>
                        <input type="url" id="publicEmbedUrl" name="embedUrl" placeholder="https://audiomack.com/embed/..." required>
                    </div>

                    <div class="form-group full">
						<label>Imagem do Artista</label>
						<label for="publicArtistImage" class="upload-zone">
							<div class="upload-icon"><i class="fa fa-user"></i></div>
							<h4>Adicionar imagem do artista</h4>
							<p>PNG, JPG ou WEBP</p>
							<img id="publicArtistImagePreview" class="upload-preview">
						</label>
						<input type="file" id="publicArtistImage" name="artistImage" accept="image/*"hidden>
					</div>

					<div class="form-group full">
						<label>Capa do Álbum</label>
						<label for="publicImage" class="upload-zone">
							<div class="upload-icon"><i class="fa fa-image"></i></div>
							<h4>Adicionar capa do álbum</h4>
							<p>Mínimo 500x500 pixels</p>
							<img id="publicAlbumImagePreview" class="upload-preview">
						</label>
						<input type="file" id="publicImage" name="image" accept="image/*"hidden required>
					</div>

                    <div class="form-group">
                        <label for="publicYear">Ano</label>
                        <input type="text" id="publicYear" name="year" placeholder="1995">
                    </div>

                    <div class="form-group">
                        <label for="publicLabel">Label</label>
                        <input type="text" id="publicLabel" name="label" placeholder="ZYX Records">
                    </div>

                    <div class="form-group">
                        <label for="publicCountry">País</label>
                        <input type="text" id="publicCountry" name="country" placeholder="Germany">
                    </div>

                    <div class="form-group">
                        <label for="publicFormat">Formato</label>
                        <input type="text" id="publicFormat" name="format" placeholder='Vinyl 12"'>
                    </div>

                    <div class="form-group">
                        <label for="publicGenre">Gênero</label>
                        <input type="text" id="publicGenre" name="genre" placeholder="Electronic">
                    </div>

                    <div class="form-group">
                        <label for="publicStyle">Style</label>
                        <input type="text" id="publicStyle" name="style" placeholder="Eurodance">
                    </div>

                    <div class="form-group full">
                        <button type="submit" class="button public-button">Enviar Álbum Para Aprovação</button>
                        <div id="publicStatus"></div>
                    </div>

                </form>

                <div class="public-note">
                    <strong>Atenção:</strong> Todos os envios passam por aprovação antes de serem publicados no site.
                </div>

            </section>

        </section>
    `;
}

// Main App Component
function App() {
    return `
			${Header()}
			${Menu()}
			${Banner()}
        
        <!-- Main -->
			<section id="main" class="wrapper align-top">
				<div class="container">
					${HomeContent()}
					${ArtistsContent()}
					${suballAlbumsContent()}
					${timelineContent()}
					${genresContent()}
					${yearAlbumsContent()}
					${musicsContent()}
					${playlistsContent()}
					${albumsContent()}
					${singlesContent()}
					${vinylsContent()}
					${djsContent()}
					${instrumentalContent()}
					${labelsContent()}
					${labelDetailsContent()}
					${videosContent()}
					${submitAlbumContent()}
					<!-- Outros tabs serão adicionados dinamicamente -->
				</div>
			</section>

        <!-- Player Page -->
			<section id="player-page" style="display: none;">
				<div class="content">
				
				<!-- Main Panel -->
					<div id="main-panel">
						<div class="player-embed"></div>
					</div>
					
				<!-- Side Panel -->
					<div id="side-panel">
						<div class="album-details">
							<h4>Detalhes do Álbum</h4>
							<div class="details-grid">
								<div class="detail-item">
									<span class="label">Artista:</span>
									<span id="detailArtist"></span>
								</div>
								<div class="detail-item">
									<span class="label">Gravadora:</span>
									<span id="detailLabel"></span>
								</div>
								<div class="detail-item">
									<span class="label">Formato:</span>
									<span id="detailFormat"></span>
								</div>
								<div class="detail-item">
									<span class="label">País:</span>
									<span id="detailCountry"></span>
								</div>
								<div class="detail-item">
									<span class="label">Ano:</span>
									<span id="detailYear"></span>
								</div>
								<div class="detail-item">
									<span class="label">Gênero:</span>
									<span id="detailGenre"></span>
								</div>
								<div class="detail-item">
									<span class="label">Estilo:</span>
									<span id="detailStyle"></span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>
		
		<!-- related Albums Panel -->
			<section id="relatedContainer">
				<header class="major">
					<h3 id="relatedArtistName"></h3>
				</header>
				<div id="relatedAlbums" class="related-grid"></div>
			</section>

        <!-- Player Bar -->
			<section id="player-bar" style="display: none;">
				<div class="content">
					<div class="image" data-position="center">
						<img id="playerImage" src="" alt="Player" />
					</div>
					<header class="align-left">
						<h3 id="playerArtist"></h3>
						<p id="playerTitle"></p>
					</header>
					<ul class="icons">
						<li><button type="button" class="icon solid fa-long-arrow-down md-ripples ripples-light"></button></li>
						<li><button type="button" class="icon solid fa-list md-ripples ripples-light"></button></li>
					</ul>
				</div>
			</section>

        <!-- Footer
			<footer id="footer">
				<span class="copyright">© Play 90 Music 2026 | <a href="https://www.forumeiros.com/">Crie um forum grátis</a></span>
			</footer> -->
		`;
}

// =====================================================
// APP CORE
// =====================================================

function renderRoot() {
    $('#app').html(App());
}

// =====================================================
// EVENTOS GLOBAIS
// =====================================================

function initGlobalEvents() {

    $(document)
        .off('click.menuToggle')
        .on('click.menuToggle', '.menuToogle', function(e) {
            e.preventDefault();
            $('body').toggleClass('is-menu-visible');
        });

    $(document)
        .off('click.menuOutside')
        .on('click.menuOutside', function(e) {
            const $menu = $('#menu');
            const $toggle = $('.menuToogle');

            if (
                $('body').hasClass('is-menu-visible') &&
                !$menu.is(e.target) &&
                $menu.has(e.target).length === 0 &&
                !$toggle.is(e.target) &&
                $toggle.has(e.target).length === 0
            ) {
                $('body').removeClass('is-menu-visible');
            }
        });

    $(document)
        .off('click.menuStop')
        .on('click.menuStop', '#menu', function(e) {
            e.stopPropagation();
        });

    $(document)
        .off('click.dropdown')
        .on('click.dropdown', '.toggle-dropdown', function(e) {
            e.preventDefault();
            e.stopPropagation();

            const $dropdown = $(this).next('.dropotron');

            $('.dropotron').not($dropdown).removeClass('dropdown-active');
            $dropdown.toggleClass('dropdown-active');
        });

    $(document)
        .off('click.dropdownOutside')
        .on('click.dropdownOutside', function() {
            $('.dropotron').removeClass('dropdown-active');
        });

    $(document)
        .off('click.dropdownStop')
        .on('click.dropdownStop', '.dropotron', function(e) {
            e.stopPropagation();
        });

    $(document)
        .off('click.bannerToggle')
        .on('click.bannerToggle', '#toggleBanner', function() {
            const $image = $('#banner .image');
            if (!$image.length) return;

            $image.toggleClass('hidden');

            $(this).text(
                $image.hasClass('hidden') ?
                'Background Color' :
                'Background Image'
            );
        });

    $(document)
        .off('click.searchToggle')
        .on('click.searchToggle', '.fa-magnifying-glass', function(e) {
            e.preventDefault();

            const $search = $('#search');

            if (window.innerWidth <= 736) {
                $search.toggle();
                $('#searchInput').focus();
            }
        });

    $(document)
        .off('click.searchOutside')
        .on('click.searchOutside', function(e) {
            const $search = $('#search');

            if (
                window.innerWidth <= 736 &&
                !$search.is(e.target) &&
                $search.has(e.target).length === 0 &&
                !$(e.target).closest('.fa-magnifying-glass').length
            ) {
                $search.hide();
            }
        });

    $(document)
        .off('input.search')
        .on('input.search', '#searchInput', function() {
            debounceSearch($(this).val());
        });

    $(document)
        .off('keypress.search')
        .on('keypress.search', '#searchInput', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                handleSearch($(this).val());
            }
        });

    $(document)
        .off('click.searchResult')
        .on('click.searchResult', '.result-item', function() {
            const id = parseInt($(this).data('id'), 10);

            if (!isNaN(id) && typeof openPlayer === 'function') {
                openPlayer(id);
            }

            $('#searchDropdown').hide();
        });

    $(document)
        .off('click.searchClose')
        .on('click.searchClose', function(e) {
            if (!$(e.target).closest('#searchInput, #searchDropdown').length) {
                $('#searchDropdown').hide();
            }
        });

    $(document)
		.off('click.homeVideos', '[data-tab="home"]')
		.on('click.homeVideos', '[data-tab="home"]', function() {

			setTimeout(function() {
				const $homeVideos = $('#homeVideos');

				if ($homeVideos.hasClass('slick-initialized')) {
					$homeVideos.slick('setPosition');
				}
			}, 80);
    });

}

// =====================================================
// SEARCH SYSTEM
// =====================================================

window.searchIndex = [];
let searchTimeout = null;

window.buildSearchIndex = function() {

    if (!window.mockFeatured) return;

    window.searchIndex = window.mockFeatured.map(item => ({
        id: item.id,
        type: item.type || 'featured',
        title: item.title || '',
        artist: item.artist || '',
        image: item.image || '',
        search: (
            (item.title || '') + ' ' +
            (item.artist || '') + ' ' +
            (item.year || '') + ' ' +
            (item.label || '') + ' ' +
            (item.genre || '') + ' ' +
            (item.style || '')
        ).toLowerCase()
    }));
};

function handleSearch(term) {

    if (typeof updatePageTitle === 'function') {
        updatePageTitle(term, 'search');
    }

    const $dropdown = $('#searchDropdown');

    if (!$dropdown.length) return;
    if (!window.searchIndex.length) return;

    if (!term || term.length < 2) {
        $dropdown.hide();
        return;
    }

    term = term.toLowerCase();

    const results = window.searchIndex
        .filter(item => item.search.includes(term))
        .slice(0, 10);

    if (!results.length) {
        $dropdown.hide();
        return;
    }

    renderSearchResults(results);
}

function renderSearchResults(results) {

    const html = results.map(item => `
        <div class="result-item" data-id="${item.id}" data-type="${item.type}">
            <img src="${item.image}" class="result-thumb" alt="">
            <div class="result-info">
                <h3>${escapeHtml(item.artist)}</h3>
                <p>${escapeHtml(item.title)}</p>
            </div>
        </div>
    `).join('');

    $('#searchDropdown').html(html).show();
}

function debounceSearch(value) {
    clearTimeout(searchTimeout);

    searchTimeout = setTimeout(function() {
        handleSearch(value);
    }, 250);
}

// =====================================================
// ACTION SLIDER
// =====================================================

function initActionSlider() {

    const $slider = $('.action-slider');
    const $arrows = $('#action-slick-arrow');

    if (!$slider.length || !$.fn.slick) return;

    $('#libraryTitle').text('Biblioteca');
    $('#libraryTitleDesc').text('Sua coleção completa de músicas');

    if ($slider.hasClass('slick-initialized')) {
        $slider.slick('unslick');
    }

    $slider.slick({
        slidesToShow: 5,
        slidesToScroll: 1,
        infinite: true,
        arrows: true,
        dots: false,
        swipeToSlide: true,
        variableWidth: true,
        appendArrows: $arrows,

        nextArrow: `
            <ul class="icons">
                <li>
                    <button type="button" class="icon solid fa-chevron-right md-ripples ripples-light"></button>
                </li>
            </ul>
        `,

        prevArrow: `
            <ul class="icons">
                <li>
                    <button type="button" class="icon solid fa-chevron-left md-ripples ripples-light"></button>
                </li>
            </ul>
        `,

        responsive: [{
			breakpoint: 900, settings: { slidesToShow: 4 } }, {
			breakpoint: 600, settings: { slidesToShow: 3 } }, {
			breakpoint: 420, settings: { slidesToShow: 2 } }
        ]
    });
}

// =====================================================
// INIT APP STRUCTURE
// =====================================================

$(document).ready(function() {

    console.log('SPA: estrutura inicializando...');

    renderRoot();
    updatePageTitle();
    initGlobalEvents();
    initActionSlider();

    setTimeout(function() {
        if (typeof hydrateUI === 'function') {
            hydrateUI();
        }
    }, 300);

});
