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
var itemId = 0;

function start() {
    status = 0;
    cm.sendSimple(getMenuText());
}

function action(mode, type, selection) {
    if (mode < 1) {
        cm.dispose();
        return;
    }
    
    status++;
    
    if (status === 1) {
        if (selection === 0) {
            // 检查条件
            let check = checkConditions();
            if (check !== "") {
                cm.sendOk(check);
                cm.dispose();
                return;
            }
            itemId = cm.getFirstInventoryEquipItemId();
            cm.sendYesNo(getConfirmText());
        }
    } else if (status === 2) {
        // 执行强化
        doEnhance();
    }
}

function getMenuText() {
    let text = "#e#d装备强化系统#k#n\r\n\r\n";
    text += "消耗物品:\r\n";
    text += "  #i" + MAPLE_LEAF + "##t" + MAPLE_LEAF + "# x " + COST_MAPLE_LEAF + " 个\r\n";
    text += "  金币 x " + COST_MESO + "\r\n\r\n";
    text += "强化效果:\r\n";
    text += "  力量 +100 | 敏捷 +100\r\n";
    text += "  智力 +100 | 运气 +100\r\n";
    text += "  物理攻击 +100 | 魔法攻击 +100\r\n";
    text += "  物理防御 +100 | 魔法防御 +100\r\n";
    text += "  HP +100 | MP +100 | 装备等级+1\r\n\r\n";
    text += "#L0# #r开始强化#k#l\r\n";
    return text;
}

function getConfirmText() {
    return "#e#d确认强化#k#n\r\n\r\n"
        + "即将强化以下装备:\r\n"
        + "  #i" + itemId + "##t" + itemId + "#\r\n\r\n"
        + "强化后装备属性将提升，装备等级+1\r\n"
        + "原有装备将被删除，是否确认？";
}

function checkConditions() {
    if (cm.getItemQuantity(MAPLE_LEAF) < COST_MAPLE_LEAF) {
        return "枫叶不足，需要 " + COST_MAPLE_LEAF + " 个枫叶";
    }
    if (cm.getMeso() < COST_MESO) {
        return "金币不足，需要 " + COST_MESO + " 金币";
    }
    let eqId = cm.getFirstInventoryEquipItemId();
    if (eqId === 0) {
        return "背包装备栏没有装备";
    }
    if (!cm.canHold(eqId, 1)) {
        return "背包空间不足，无法放入装备";
    }
    return "";
}

function doEnhance() {
    cm.gainItem(MAPLE_LEAF, -COST_MAPLE_LEAF);
    cm.gainMeso(-COST_MESO);
    
    cm.enhanceFirstInventoryEquip(
        STAT_BONUS, STAT_BONUS, STAT_BONUS, STAT_BONUS,
        ATK_BONUS, ATK_BONUS,
        DEF_BONUS, DEF_BONUS,
        HPMP_BONUS, HPMP_BONUS
    );
    
    cm.sendOk("强化成功！\r\n\r\n装备已强化完成");
    cm.dispose();
}
