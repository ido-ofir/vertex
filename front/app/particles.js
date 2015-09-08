

module.exports = {
  makeSystem(){
    var particleCount = 1800,
        particles = new THREE.Geometry(),
        pMaterial = new THREE.ParticleBasicMaterial({
          color: 0xFFFFFF,
          size: 1,
          map: THREE.ImageUtils.loadTexture(
            "electric.png"
          ),
          blending: THREE.AdditiveBlending,
          transparent: true
        });

// also update the particle system to
// sort the particles which enables
// the behaviour we want


    // now create the individual particles
    for (var p = 0; p < particleCount; p++) {

      // create a particle with random
      // position values, -250 -> 250
      var pX = Math.random() - 0.5,
          pY = Math.random() - 0.5,
          pZ = Math.random() - 0.5,
          particle = new THREE.Vector3(pX, pY, pZ);

      // add it to the geometry
      particles.vertices.push(particle);
    }

    // create the particle system
    var particleSystem = new THREE.ParticleSystem(particles, pMaterial);
    return particleSystem;
  }
}
