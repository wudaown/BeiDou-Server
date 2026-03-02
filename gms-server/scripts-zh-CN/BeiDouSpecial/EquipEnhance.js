/**
 * @description 装备强化脚本
 * 扣除1000个枫叶，1000万金币
 * 删除玩家背包(未装备)第一件装备
 * 生成一个一样的装备，原有属性+100，攻击+100，防御+100，生命/魔法+100
 */

const MAPLE_LEAF = 4001126;
const COST_MAPLE_LEAF = 1000;
const COST_MESO = 10000000;
const STAT_BONUS = 100;
const ATK_BONUS = 100;
const DEF_BONUS = 100;
const HPMP_BONUS = 100;

var status = 0;

function start() {
    status = 0;
    cm.sendSimple(cm.getEnhanceInfo());
}

function action(mode, type, selection) {
    if (mode < 1) {
        cm.dispose();
        return;
    }
    
    status++;
    
    if (status === 1) {
        if (selection === 0) {
            // 确认强化
            cm.sendYesNo(cm.getEnhanceConfirm());
        }
    } else if (status === 2) {
        // 执行强化
        doEnhance();
    }
}

function doEnhance() {
    if (cm.getItemQuantity(MAPLE_LEAF) < COST_MAPLE_LEAF) {
        cm.sendOk("枫叶不足，需要 " + COST_MAPLE_LEAF + " 个枫叶");
        cm.dispose();
        return;
    }
    if (cm.getMeso() < COST_MESO) {
        cm.sendOk("金币不足，需要 " + COST_MESO + " 金币");
        cm.dispose();
        return;
    }
    
    let oldItemId = cm.getFirstInventoryEquipItemId();
    if (oldItemId === 0) {
        cm.sendOk("背包装备栏没有装备");
        cm.dispose();
        return;
    }
    
    if (!cm.canHold(oldItemId, 1)) {
        cm.sendOk("背包空间不足，无法放入装备");
        cm.dispose();
        return;
    }
    
    cm.gainItem(MAPLE_LEAF, -COST_MAPLE_LEAF);
    cm.gainMeso(-COST_MESO);
    
    cm.enhanceFirstInventoryEquip(
        STAT_BONUS, STAT_BONUS, STAT_BONUS, STAT_BONUS,
        ATK_BONUS, ATK_BONUS,
        DEF_BONUS, DEF_BONUS,
        HPMP_BONUS, HPMP_BONUS
    );
    
    cm.sendOk("强化成功！\r\n\r\n原始装备ID: #i" + oldItemId + "##t" + oldItemId + "#\r\n强化属性: 力量+100 敏捷+100 智力+100 运气+100 物理攻击+100 魔法攻击+100 物理防御+100 魔法防御+100 HP+100 MP+100");
    cm.dispose();
}
