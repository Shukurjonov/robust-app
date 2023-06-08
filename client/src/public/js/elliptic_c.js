// O'zgarmaslarni e'lon qilib olish
function getEncryptionInfo() {
  return {
    base_point: {
      x: base_point_a.value,
      y: base_point_b.value
    },
    limited_payd_info: {
      p: _base_point_odd_number.value,
      a: _base_point_coff_a.value,
      b: _base_point_coff_b.value
    },
    private_key: _base_point_private_key.value
  }
}

var encriptionInfo = getEncryptionInfo(); 


// C = (9, 4)
// E_37 (2,9)
const basis_point = [encriptionInfo.base_point.x, encriptionInfo.base_point.y],
  p = +encriptionInfo.limited_payd_info.p,
  a = +encriptionInfo.limited_payd_info.a,
  b = +encriptionInfo.limited_payd_info.b
;

// Function mod negative number use
function modMinus(a, n) {
  return ((a % n) + n) % n
}

// Modlab berish uchun
// ax mod n = 1
function modCalcOne(a, n) {
  let i = 1;
  while (a * i % n != 1) {
    i++
  };

  return i;
};



// Nuqtani ikkinlantirish yoki ikki nuqtani qo'shish
function point_add(P, Q) {
  let xp = +P[0], yp = +P[1], xq = +Q[0], yq = +Q[1];
  if (xp == xq && yp == yq) return two_point(P);
  let m_surat = yp - yq;
  let m_mahraj = (Math.abs(xp - xq) / (xp - xq)) * modCalcOne(Math.abs(xp - xq), p);
  let m = modMinus(m_surat * m_mahraj, p);
  let xr = modMinus(m * m - xp - xq, p);
  let yr = modMinus(yp + m * (xr - xp), p);
  let R = [modMinus(xr, p), modMinus(-yr, p)];
  return R;
};

// 2*P
function two_point(P) {
  let xp = +P[0], yp = +P[1];

  let m_surat = 3 * xp * xp + a;
  let m_mahraj = modCalcOne(2 * yp, p);
  let m = modMinus(m_surat * m_mahraj, p);
  let xr = modMinus(m * m - 2 * xp, p);
  let yr = modMinus(yp + m * (xr - xp), p);
  let R = [modMinus(xr, p), modMinus(-yr, p)];
  return R;
};

// nP function
function n_point(P, a) {
  let bin_a = a.toString(2);
  let result = null
  for (let i = 0; i < bin_a.length; i++) {
    if (bin_a[i] == 1) {
      if (!result) result = P;
      else {
        result = point_add(result, P);
      }
    }
    P = two_point(P);
  }
  return result;
}


// Generation key
async function generate(alice, bob) {

  console.log(basis_point, a, b, alice, bob)
  let point_A =  n_point(basis_point, alice);

  let point_B = n_point((basis_point), bob);

  let point_Ab = n_point(point_B, alice);
  let point_Ba = n_point(point_A, bob);

  console.log({
    'Alice': {
      'Ab': point_Ab
    },
    'Bob': {
      'Ba': point_Ba
    }
  })

  var key = CryptoJS.MD5(point_Ab.toString());
  console.log(key)
  window.localStorage.setItem('encriptionKey', key)
  return key;
}

/*
async function sha256Hash(input) {
  const encoder = new TextEncoder();
  const data = encoder.encode(input);

  const hashBuffer = await crypto.subtle.digest('SHA-256', data);

  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashedValue = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');

  return hashedValue;
}*/