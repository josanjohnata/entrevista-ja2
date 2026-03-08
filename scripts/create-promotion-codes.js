/**
 * Script para criar Promotion Codes no Stripe
 * 
 * Execute este script para criar os códigos promocionais PROMO10 e PROMO2
 * 
 * Pré-requisitos:
 * 1. Ter o Stripe CLI instalado ou usar a API diretamente
 * 2. Ter a chave secreta do Stripe configurada
 * 3. Criar os cupons primeiro (se ainda não existirem)
 * 
 * Como usar:
 * 1. Configure a variável STRIPE_SECRET_KEY
 * 2. Execute: node scripts/create-promotion-codes.js
 */

const Stripe = require('stripe');

// Configure sua chave secreta do Stripe aqui
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || 'sk_test_...';

if (!STRIPE_SECRET_KEY || STRIPE_SECRET_KEY === 'sk_test_...') {
  console.error('❌ Erro: Configure STRIPE_SECRET_KEY no arquivo .env ou neste script');
  process.exit(1);
}

const stripe = new Stripe(STRIPE_SECRET_KEY, {
  apiVersion: '2024-12-18.acacia',
});

async function createPromotionCodes() {
  try {
    console.log('🚀 Criando Promotion Codes no Stripe...\n');

    // Primeiro, vamos verificar se os cupons existem ou criá-los
    console.log('📋 Verificando/Criando cupons...');
    
    // Cupom para PROMO10 (Brasil - R$ 10 de desconto)
    let couponPromo10;
    try {
      couponPromo10 = await stripe.coupons.retrieve('PROMO10');
      console.log('✅ Cupom PROMO10 já existe');
    } catch (error) {
      if (error.code === 'resource_missing') {
        couponPromo10 = await stripe.coupons.create({
          id: 'PROMO10',
          name: 'Promoção Brasil - R$ 10',
          amount_off: 1000, // R$ 10,00 em centavos
          currency: 'brl',
          duration: 'once', // ou 'forever', 'repeating'
        });
        console.log('✅ Cupom PROMO10 criado');
      } else {
        throw error;
      }
    }

    // Cupom para PROMO2 (Outras regiões - $2 ou €2 de desconto)
    let couponPromo2;
    try {
      couponPromo2 = await stripe.coupons.retrieve('PROMO2');
      console.log('✅ Cupom PROMO2 já existe');
    } catch (error) {
      if (error.code === 'resource_missing') {
        // Criar cupom para USD
        couponPromo2 = await stripe.coupons.create({
          id: 'PROMO2',
          name: 'Promoção Internacional - $2',
          amount_off: 200, // $2,00 em centavos
          currency: 'usd',
          duration: 'once',
        });
        console.log('✅ Cupom PROMO2 criado');
      } else {
        throw error;
      }
    }

    console.log('\n📝 Criando Promotion Codes...\n');

    // Criar Promotion Code PROMO10
    try {
      const promo10 = await stripe.promotionCodes.create({
        coupon: couponPromo10.id,
        code: 'PROMO10',
        active: true,
      });
      console.log('✅ Promotion Code PROMO10 criado com sucesso!');
      console.log(`   ID: ${promo10.id}`);
      console.log(`   Código: ${promo10.code}`);
    } catch (error) {
      if (error.code === 'resource_already_exists') {
        console.log('⚠️  Promotion Code PROMO10 já existe');
      } else {
        console.error('❌ Erro ao criar PROMO10:', error.message);
      }
    }

    // Criar Promotion Code PROMO2
    try {
      const promo2 = await stripe.promotionCodes.create({
        coupon: couponPromo2.id,
        code: 'PROMO2',
        active: true,
      });
      console.log('✅ Promotion Code PROMO2 criado com sucesso!');
      console.log(`   ID: ${promo2.id}`);
      console.log(`   Código: ${promo2.code}`);
    } catch (error) {
      if (error.code === 'resource_already_exists') {
        console.log('⚠️  Promotion Code PROMO2 já existe');
      } else {
        console.error('❌ Erro ao criar PROMO2:', error.message);
      }
    }

    console.log('\n✨ Processo concluído!');
    console.log('\n📌 Próximos passos:');
    console.log('1. Teste os códigos no checkout do Stripe');
    console.log('2. Verifique se os códigos aparecem no Dashboard do Stripe');
    console.log('3. Certifique-se de que os cupons estão ativos');

  } catch (error) {
    console.error('❌ Erro ao criar Promotion Codes:', error.message);
    console.error('   Detalhes:', error);
    process.exit(1);
  }
}

// Executar o script
createPromotionCodes();

