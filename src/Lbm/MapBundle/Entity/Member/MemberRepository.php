<?php

namespace Lbm\MapBundle\Entity\Member;

use Doctrine\ORM\EntityRepository;
/**
 * MemberRepository
 *
 * This class was generated by the Doctrine ORM. Add your own custom
 * repository methods below.
 */
class MemberRepository extends EntityRepository
{
    public function isPseudoAlreadyExist( $pseudo,  $ip) {
        $query = $this->_em->createQuery(
            "SELECT COUNT(m) as mbr FROM Lbm\\MapBundle\\Entity\\Member\\Member as m WHERE (m.ip LIKE :ip OR m.pseudo LIKE :pseudo) AND m.ip != '127.0.0.1'"
        )->setParameter('ip',$ip)
         ->setParameter('pseudo',$pseudo);

        $result = $query->getSingleScalarResult();

        return  $result > 0;
    }


}
