function fullScreen() {
    return new Promise((resolve, reject) => {
        const contenedor = document.getElementById("contenedor");
        
        if (contenedor.requestFullscreen) {
            contenedor.requestFullscreen().then(resolve).catch(reject);
        } else if (contenedor.mozRequestFullScreen) {
            contenedor.mozRequestFullScreen().then(resolve).catch(reject);
        } else if (contenedor.webkitRequestFullscreen) {
            contenedor.webkitRequestFullscreen().then(resolve).catch(reject);
        } else if (contenedor.msRequestFullscreen) {
            contenedor.msRequestFullscreen().then(resolve).catch(reject);
        } else {
            reject('Fullscreen API no soportada');
        }
    });
}

function lockOrientation(orientation) {
    // Verificar si screen.orientation está disponible
    if (screen.orientation && screen.orientation.lock) {
        screen.orientation.lock(orientation)
            .then(() => {
                console.log(`Orientación bloqueada a ${orientation}`);
            })
            .catch((error) => {
                console.warn(`No se pudo bloquear la orientación: ${error}`);
            });
    } else {
        console.warn('API de bloqueo de orientación no soportada');
    }
}

function unlockOrientation() {
    if (screen.orientation && screen.orientation.unlock) {
        screen.orientation.unlock();
        console.log('Orientación desbloqueada');
    }
}

async function toggleFullScreen() {
    try {
        if (!document.fullscreenElement) {
            // Entrar en pantalla completa y forzar horizontal
            await fullScreen();
            
            // En móviles, forzar landscape
            if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
                // Intentar landscape-primary (preferido) o landscape
                lockOrientation('landscape');
            }
            
            // Actualizar texto del botón
            document.getElementById('btnFS').textContent = 'SALIR PANTALLA COMPLETA';
        } else {
            // Salir de pantalla completa
            if (document.exitFullscreen) {
                await document.exitFullscreen();
                
                // Desbloquear orientación al salir
                unlockOrientation();
                
                // Actualizar texto del botón
                document.getElementById('btnFS').textContent = 'PANTALLA COMPLETA';
            }
        }
    } catch (error) {
        console.error('Error al cambiar pantalla completa:', error);
    }
}

// Escuchar cambios en pantalla completa
document.addEventListener('fullscreenchange', handleFullscreenChange);
document.addEventListener('mozfullscreenchange', handleFullscreenChange);
document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
document.addEventListener('MSFullscreenChange', handleFullscreenChange);

function handleFullscreenChange() {
    if (!document.fullscreenElement) {
        // Si salimos de pantalla completa, desbloquear orientación
        unlockOrientation();
        document.getElementById('btnFS').textContent = 'PANTALLA COMPLETA';
    }
}
